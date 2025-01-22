import { css } from '@firebolt-dev/css'
import React, { useState, useEffect, useRef } from 'react'

// App metadata
const APP_INFO = {
  id: 'screen-share',
  name: 'Screen Share',
  version: '1.0.0',
  description: 'Share your PC screen, app windows or camera on your HyperFone',
  author: 'HyperFone',
  icon: '📱',
  category: 'utilities',
  permissions: ['screen-capture', 'camera'],
}

// Default configuration
const DEFAULT_CONFIG = {
  theme: {
    primary: '#551bf9',
    background: '#1a1a1a', 
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.1)',
    error: '#ff4444',
  },
  settings: {
    preferredSource: null,
    frameRate: 30,
    quality: 'high'
  }
}

export function ScreenShare({ theme }) {
  // State
  const [sources, setSources] = useState([])
  const [selectedSource, setSelectedSource] = useState(null)
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState(null)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  
  // Refs
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Load saved configuration
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(`hyperfy_${APP_INFO.id}_config`)
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    } catch (err) {
      console.error('Failed to load config:', err)
      setError('Failed to load app configuration')
    }
  }, [])

  // Get available sources on mount
  useEffect(() => {
    const getSources = async () => {
      try {
        // Get list of available sources
        const availableSources = await navigator.mediaDevices.enumerateDevices()
        
        // Filter video sources
        const videoSources = availableSources.filter(
          source => source.kind === 'videoinput'
        )

        // Add screen capture option
        const sources = [
          {
            id: 'screen',
            label: 'Screen',
            type: 'screen'
          },
          {
            id: 'window',
            label: 'Application Window', 
            type: 'window'
          },
          ...videoSources.map(source => ({
            id: source.deviceId,
            label: source.label || `Camera ${source.deviceId.slice(0,4)}`,
            type: 'camera'
          }))
        ]

        setSources(sources)

        // Set preferred source if saved
        if (config.settings.preferredSource) {
          const preferred = sources.find(s => s.id === config.settings.preferredSource)
          if (preferred) {
            setSelectedSource(preferred)
          }
        }

      } catch (err) {
        console.error('Failed to get sources:', err)
        setError('Failed to get available sources')
      }
    }

    getSources()
  }, [config.settings.preferredSource])

  // Start sharing
  const startSharing = async () => {
    try {
      if (!selectedSource) return
      console.log('Starting share with source:', selectedSource)
      
      // Check video element reference first
      if (!videoRef.current) {
        console.error('Video element not mounted')
        setError('Video element not ready. Please try again.')
        return
      }
      
      let stream

      if (selectedSource.type === 'screen') {
        console.log('Getting display media for screen')
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always',
            frameRate: config.settings.frameRate,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        })
      } else if (selectedSource.type === 'window') {
        console.log('Getting display media for window')
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: 'window',
            cursor: 'always',
            frameRate: config.settings.frameRate,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        })
      } else {
        console.log('Getting user media for camera')
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedSource.id,
            frameRate: config.settings.frameRate,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        })
      }

      console.log('Got media stream:', stream)
      console.log('Video tracks:', stream.getVideoTracks())

      // Save stream reference
      streamRef.current = stream

      // Set up stream ended handler
      stream.getVideoTracks()[0].onended = () => {
        console.log('Stream ended')
        stopSharing()
      }

      // Double check video element reference
      if (!videoRef.current) {
        console.error('Video element lost after stream setup')
        setError('Video element not found. Please try again.')
        stopSharing()
        return
      }

      // Set video source and ensure it plays
      try {
        console.log('Setting video source')
        videoRef.current.srcObject = stream
        
        // Add event listeners for debugging
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded')
          console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
        }
        
        videoRef.current.onplaying = () => {
          console.log('Video playing')
          console.log('Video element dimensions:', videoRef.current.offsetWidth, 'x', videoRef.current.offsetHeight)
        }

        // Wait for the video element to be ready
        await new Promise((resolve, reject) => {
          videoRef.current.onloadeddata = resolve
          videoRef.current.onerror = reject
          setTimeout(reject, 5000) // 5 second timeout
        })

        await videoRef.current.play()
        console.log('Video play() succeeded')
        
        setIsSharing(true)
        console.log('Sharing started successfully')

        // Save preferred source
        const newConfig = {
          ...config,
          settings: {
            ...config.settings,
            preferredSource: selectedSource.id
          }
        }
        setConfig(newConfig)
        localStorage.setItem(`hyperfy_${APP_INFO.id}_config`, JSON.stringify(newConfig))

      } catch (err) {
        console.error('Failed to initialize video:', err)
        setError('Failed to initialize video. Please try again.')
        stopSharing()
        return
      }

    } catch (err) {
      console.error('Failed to start sharing:', err)
      setError('Failed to start sharing. Please try again.')
      stopSharing()
    }
  }

  // Stop sharing
  const stopSharing = () => {
    console.log('Stopping share')
    if (streamRef.current) {
      console.log('Stopping tracks')
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        streamRef.current.removeTrack(track)
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      console.log('Cleaning up video element')
      videoRef.current.srcObject = null
      videoRef.current.load()
    }
    setIsSharing(false)
    console.log('Share stopped')
  }

  // Handle video element errors
  const handleVideoError = (e) => {
    console.error('Video error:', e)
    console.error('Video error message:', e.target.error.message)
    setError(`Video playback error: ${e.target.error.message}`)
    stopSharing()
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up')
      stopSharing()
    }
  }, [])

  return (
    <div css={css`
      display: flex;
      flex-direction: column;
      height: 100%;
      background: ${theme.background || config.theme.background};
      color: ${theme.text || config.theme.text};
      padding: 20px;
    `}>
      {/* Header */}
      <div css={css`
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
        flex-shrink: 0;
      `}>
        <span css={css`font-size: 24px;`}>{APP_INFO.icon}</span>
        <h1 css={css`
          margin: 0;
          font-size: 18px;
          font-weight: 500;
        `}>
          {APP_INFO.name}
        </h1>
      </div>

      {/* Error message */}
      {error && (
        <div css={css`
          background: ${theme.error || config.theme.error}22;
          border: 1px solid ${theme.error || config.theme.error};
          color: ${theme.error || config.theme.error};
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          flex-shrink: 0;
        `}>
          {error}
          <button 
            onClick={() => setError(null)}
            css={css`
              float: right;
              background: none;
              border: none;
              color: inherit;
              cursor: pointer;
              padding: 0 5px;
            `}
          >
            ×
          </button>
        </div>
      )}

      {/* Main content wrapper */}
      <div css={css`
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        gap: 20px;
        overflow: hidden;
      `}>
        {/* Source selection */}
        {!isSharing && (
          <div css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex-shrink: 0;
          `}>
            <label css={css`color: ${theme.textSecondary || config.theme.textSecondary};`}>
              Select Source
            </label>
            <div css={css`
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 10px;
            `}>
              {sources.map(source => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source)}
                  css={css`
                    background: ${selectedSource?.id === source.id ? 
                      (theme.primary || config.theme.primary) + '33' : 
                      'transparent'
                    };
                    border: 1px solid ${selectedSource?.id === source.id ?
                      (theme.primary || config.theme.primary) :
                      (theme.border || config.theme.border)
                    };
                    color: ${theme.text || config.theme.text};
                    padding: 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.2s ease;
                    
                    &:hover {
                      background: ${(theme.primary || config.theme.primary) + '22'};
                      border-color: ${theme.primary || config.theme.primary};
                    }
                  `}
                >
                  <span css={css`font-size: 24px;`}>
                    {source.type === 'screen' ? '🖥️' : 
                     source.type === 'window' ? '🪟' : 
                     '📷'}
                  </span>
                  <span css={css`
                    font-size: 14px;
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                  `}>
                    {source.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video preview */}
        <div css={css`
          flex: 1;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        `}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onError={handleVideoError}
            css={css`
              width: 100%;
              height: 100%;
              object-fit: contain;
              display: ${isSharing ? 'block' : 'none'};
            `}
          />
          
          {!isSharing && (
            <div css={css`
              color: ${theme.textSecondary || config.theme.textSecondary};
              text-align: center;
              padding: 20px;
            `}>
              {selectedSource ? 
                'Click Start to begin sharing' :
                'Select a source to begin'
              }
            </div>
          )}
          
          {/* Video overlay for debugging */}
          {isSharing && (
            <div css={css`
              position: absolute;
              top: 10px;
              left: 10px;
              background: rgba(0, 0, 0, 0.5);
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 12px;
            `}>
              Stream Active
            </div>
          )}
        </div>
      </div>

      {/* Controls - Moved outside the main content wrapper */}
      <div css={css`
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
        padding: 15px;
        border-radius: 8px;
        background: ${theme.background || config.theme.background};
        border: 1px solid ${theme.border || config.theme.border};
        flex-shrink: 0;
      `}>
        {isSharing ? (
          <button
            onClick={stopSharing}
            css={css`
              background: ${theme.error || config.theme.error}22;
              border: 1px solid ${theme.error || config.theme.error};
              color: ${theme.error || config.theme.error};
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 500;
              transition: all 0.2s ease;
              
              &:hover {
                background: ${theme.error || config.theme.error}33;
              }
            `}
          >
            Stop Sharing
          </button>
        ) : (
          <button
            onClick={startSharing}
            disabled={!selectedSource}
            css={css`
              background: ${theme.primary || config.theme.primary}22;
              border: 1px solid ${theme.primary || config.theme.primary};
              color: ${theme.primary || config.theme.primary};
              padding: 10px 20px;
              border-radius: 8px;
              cursor: ${selectedSource ? 'pointer' : 'not-allowed'};
              font-weight: 500;
              opacity: ${selectedSource ? 1 : 0.5};
              transition: all 0.2s ease;
              
              &:hover {
                background: ${selectedSource ? 
                  (theme.primary || config.theme.primary) + '33' : 
                  (theme.primary || config.theme.primary) + '22'
                };
              }
            `}
          >
            Start Sharing
          </button>
        )}
      </div>
    </div>
  )
} 