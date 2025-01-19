import { css } from '@firebolt-dev/css'
import { useState, useRef } from 'react'
import { themes, defaultWallpaper } from '../hyperfone_core/themes'

export function SettingsApp({ 
  currentTheme, 
  setCurrentTheme, 
  currentWallpaper, 
  setCurrentWallpaper,
  customThemes,
  addCustomTheme,
  removeCustomTheme,
  customWallpapers,
  addCustomWallpaper,
  removeCustomWallpaper
}) {
  const [activeSection, setActiveSection] = useState('theme')
  const [isCreatingTheme, setIsCreatingTheme] = useState(false)
  const [newTheme, setNewTheme] = useState({
    name: '',
    primary: '#000000',
    background: '#000000',
    border: '#000000',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.4)'
  })
  const fileInputRef = useRef(null)

  const handleCreateTheme = () => {
    if (!newTheme.name) return
    
    const themeId = newTheme.name.toLowerCase().replace(/\s+/g, '-')
    addCustomTheme({
      id: themeId,
      ...newTheme
    })
    
    setIsCreatingTheme(false)
    setNewTheme({
      name: '',
      primary: '#000000',
      background: '#000000',
      border: '#000000',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.4)'
    })
  }

  const handleWallpaperUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload an image smaller than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const wallpaperId = `wallpaper-${Date.now()}`
      addCustomWallpaper({
        id: wallpaperId,
        name: file.name.split('.')[0],
        url: event.target.result
      })
      setCurrentWallpaper(wallpaperId)
    }
    reader.readAsDataURL(file)
    
    // Reset input
    e.target.value = ''
  }

  const allThemes = { ...themes, ...customThemes }

  return (
    <div css={css`
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 20px;
      color: ${allThemes[currentTheme].text};
      overflow-y: auto;
    `}>
      {/* Section Tabs */}
      <div css={css`
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      `}>
        {['theme', 'wallpaper'].map(section => (
          <button
            key={section}
            css={css`
              background: ${activeSection === section ? allThemes[currentTheme].primary : 'transparent'};
              border: 1px solid ${allThemes[currentTheme].primary};
              color: ${activeSection === section ? allThemes[currentTheme].background : allThemes[currentTheme].primary};
              padding: 8px 16px;
              border-radius: 20px;
              cursor: pointer;
              transition: all 0.2s ease;
              text-transform: capitalize;
              
              &:hover {
                background: ${allThemes[currentTheme].primary}22;
              }
            `}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Theme Selection */}
      {activeSection === 'theme' && (
        <>
          {/* Create Theme Button */}
          <button
            css={css`
              background: ${allThemes[currentTheme].primary};
              border: none;
              color: ${allThemes[currentTheme].background};
              padding: 12px;
              border-radius: 16px;
              cursor: pointer;
              margin-bottom: 20px;
              font-weight: 600;
              transition: all 0.2s ease;
              
              &:hover {
                filter: brightness(1.1);
                transform: translateY(-2px);
              }
            `}
            onClick={() => setIsCreatingTheme(true)}
          >
            Create Custom Theme
          </button>

          {/* Theme Creator */}
          {isCreatingTheme && (
            <div css={css`
              background: ${allThemes[currentTheme].border};
              border-radius: 16px;
              padding: 20px;
              margin-bottom: 20px;
            `}>
              <h3 css={css`
                margin: 0 0 15px 0;
                color: ${allThemes[currentTheme].text};
              `}>
                Create New Theme
              </h3>
              
              <div css={css`
                display: flex;
                flex-direction: column;
                gap: 15px;
              `}>
                <div>
                  <label css={css`
                    display: block;
                    margin-bottom: 5px;
                    color: ${allThemes[currentTheme].text};
                  `}>
                    Theme Name
                  </label>
                  <input
                    type="text"
                    value={newTheme.name}
                    onChange={e => setNewTheme(prev => ({ ...prev, name: e.target.value }))}
                    css={css`
                      width: 100%;
                      padding: 8px;
                      border-radius: 8px;
                      border: 1px solid ${allThemes[currentTheme].border};
                      background: ${allThemes[currentTheme].background};
                      color: ${allThemes[currentTheme].text};
                    `}
                  />
                </div>

                {['primary', 'background', 'border', 'text'].map(color => (
                  <div key={color}>
                    <label css={css`
                      display: block;
                      margin-bottom: 5px;
                      color: ${allThemes[currentTheme].text};
                      text-transform: capitalize;
                    `}>
                      {color} Color
                    </label>
                    <div css={css`
                      display: flex;
                      gap: 10px;
                    `}>
                      <input
                        type="color"
                        value={newTheme[color]}
                        onChange={e => setNewTheme(prev => ({ ...prev, [color]: e.target.value }))}
                        css={css`
                          width: 50px;
                          height: 34px;
                          padding: 0;
                          border: none;
                          border-radius: 8px;
                          background: none;
                          cursor: pointer;
                        `}
                      />
                      <input
                        type="text"
                        value={newTheme[color]}
                        onChange={e => setNewTheme(prev => ({ ...prev, [color]: e.target.value }))}
                        css={css`
                          flex: 1;
                          padding: 8px;
                          border-radius: 8px;
                          border: 1px solid ${allThemes[currentTheme].border};
                          background: ${allThemes[currentTheme].background};
                          color: ${allThemes[currentTheme].text};
                          font-family: monospace;
                        `}
                      />
                    </div>
                  </div>
                ))}

                <div css={css`
                  display: flex;
                  gap: 10px;
                  margin-top: 10px;
                `}>
                  <button
                    css={css`
                      flex: 1;
                      padding: 10px;
                      border-radius: 12px;
                      border: none;
                      background: ${allThemes[currentTheme].primary};
                      color: ${allThemes[currentTheme].background};
                      cursor: pointer;
                      font-weight: 600;
                      transition: all 0.2s ease;
                      
                      &:hover {
                        filter: brightness(1.1);
                      }
                    `}
                    onClick={handleCreateTheme}
                  >
                    Create Theme
                  </button>
                  <button
                    css={css`
                      flex: 1;
                      padding: 10px;
                      border-radius: 12px;
                      border: 1px solid ${allThemes[currentTheme].primary};
                      background: transparent;
                      color: ${allThemes[currentTheme].primary};
                      cursor: pointer;
                      font-weight: 600;
                      transition: all 0.2s ease;
                      
                      &:hover {
                        background: ${allThemes[currentTheme].primary}22;
                      }
                    `}
                    onClick={() => setIsCreatingTheme(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Theme Grid */}
          <div css={css`
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          `}>
            {Object.entries(allThemes).map(([themeId, theme]) => (
              <div
                key={themeId}
                css={css`
                  position: relative;
                `}
              >
                <button
                  css={css`
                    width: 100%;
                    background: ${theme.background};
                    border: 2px solid ${currentTheme === themeId ? theme.primary : theme.border};
                    border-radius: 16px;
                    padding: 15px;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s ease;
                    
                    &:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 8px 24px ${theme.primary}22;
                    }
                  `}
                  onClick={() => setCurrentTheme(themeId)}
                >
                  <div css={css`
                    font-weight: 600;
                    color: ${theme.text};
                    margin-bottom: 8px;
                  `}>
                    {theme.name}
                  </div>
                  <div css={css`
                    display: flex;
                    gap: 8px;
                  `}>
                    {[theme.primary, theme.background, theme.border].map((color, i) => (
                      <div
                        key={i}
                        css={css`
                          width: 20px;
                          height: 20px;
                          border-radius: 10px;
                          background: ${color};
                          border: 1px solid rgba(255, 255, 255, 0.1);
                        `}
                      />
                    ))}
                  </div>
                </button>

                {/* Delete button for custom themes */}
                {customThemes[themeId] && (
                  <button
                    css={css`
                      position: absolute;
                      top: -8px;
                      right: -8px;
                      width: 24px;
                      height: 24px;
                      border-radius: 12px;
                      border: none;
                      background: ${allThemes[currentTheme].primary};
                      color: ${allThemes[currentTheme].background};
                      font-size: 14px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      cursor: pointer;
                      transition: all 0.2s ease;
                      
                      &:hover {
                        filter: brightness(1.1);
                        transform: scale(1.1);
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeCustomTheme(themeId)
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Wallpaper Selection */}
      {activeSection === 'wallpaper' && (
        <>
          {/* Upload Button */}
          <button
            css={css`
              background: ${allThemes[currentTheme].primary};
              border: none;
              color: ${allThemes[currentTheme].background};
              padding: 12px;
              border-radius: 16px;
              cursor: pointer;
              margin-bottom: 20px;
              font-weight: 600;
              transition: all 0.2s ease;
              
              &:hover {
                filter: brightness(1.1);
                transform: translateY(-2px);
              }
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Wallpaper
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleWallpaperUpload}
            css={css`display: none;`}
          />

          {/* Wallpaper Grid */}
          <div css={css`
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          `}>
            {/* Default Option */}
            <div css={css`position: relative;`}>
              <button
                css={css`
                  position: relative;
                  width: 100%;
                  aspect-ratio: 9/16;
                  border-radius: 16px;
                  overflow: hidden;
                  cursor: pointer;
                  border: 2px solid ${currentWallpaper === 'default' ? allThemes[currentTheme].primary : 'transparent'};
                  transition: all 0.2s ease;
                  background: ${allThemes[currentTheme].border};
                  
                  &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                  }
                `}
                onClick={() => setCurrentWallpaper('default')}
              >
                <div css={css`
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  padding: 10px;
                  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
                  color: white;
                  font-size: 14px;
                `}>
                  No Wallpaper
                </div>
              </button>
            </div>

            {/* Custom Wallpapers */}
            {Object.entries(customWallpapers).map(([wallpaperId, wallpaper]) => (
              <div
                key={wallpaperId}
                css={css`position: relative;`}
              >
                <button
                  css={css`
                    position: relative;
                    width: 100%;
                    aspect-ratio: 9/16;
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 2px solid ${currentWallpaper === wallpaperId ? allThemes[currentTheme].primary : 'transparent'};
                    transition: all 0.2s ease;
                    
                    &:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                    }
                  `}
                  onClick={() => setCurrentWallpaper(wallpaperId)}
                >
                  <img
                    src={wallpaper.url}
                    css={css`
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    `}
                    alt={wallpaper.name}
                  />
                  <div css={css`
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 10px;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
                    color: white;
                    font-size: 14px;
                  `}>
                    {wallpaper.name}
                  </div>
                </button>

                {/* Delete Button */}
                <button
                  css={css`
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    border-radius: 12px;
                    border: none;
                    background: ${allThemes[currentTheme].primary};
                    color: ${allThemes[currentTheme].background};
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    z-index: 1;
                    
                    &:hover {
                      filter: brightness(1.1);
                      transform: scale(1.1);
                    }
                  `}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCustomWallpaper(wallpaperId)
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 