import { css } from '@firebolt-dev/css'
import { useState, useEffect, useRef } from 'react'

export function ChatApp({
  user,
  messages,
  sendMessage,
  onlineUsers
}) {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    sendMessage(newMessage)
    setNewMessage('')
  }

  return (
    <div css={css`
      display: flex;
      flex-direction: column;
      height: 100%;
    `}>
      {/* Online Users */}
      <div css={css`
        padding: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      `}>
        <div css={css`
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          margin-bottom: 10px;
        `}>
          Online Users ({onlineUsers.length})
        </div>
        <div css={css`
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 5px;
          
          /* Custom Scrollbar */
          &::-webkit-scrollbar {
            height: 4px;
          }
          
          &::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
          }
          
          &::-webkit-scrollbar-thumb {
            background: rgba(85, 27, 249, 0.3);
            border-radius: 2px;
            
            &:hover {
              background: rgba(85, 27, 249, 0.5);
            }
          }
        `}>
          {onlineUsers.map((user, i) => (
            <div
              key={i}
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
                min-width: 50px;
              `}
            >
              <div css={css`
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
                position: relative;
                
                &:after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  width: 12px;
                  height: 12px;
                  background: #4CAF50;
                  border: 2px solid rgba(0, 0, 0, 0.8);
                  border-radius: 50%;
                }
              `}>
                <img
                  src={user.picture || 'https://hyperfy.xyz/logo-icon.svg'}
                  alt={user.name}
                  css={css`
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  `}
                />
              </div>
              <div css={css`
                color: rgba(255, 255, 255, 0.8);
                font-size: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
                text-align: center;
              `}>
                {user.name || 'Anonymous'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div css={css`
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        
        /* Custom Scrollbar */
        &::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        &::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: rgba(85, 27, 249, 0.3);
          border-radius: 4px;
          
          &:hover {
            background: rgba(85, 27, 249, 0.5);
          }
        }
      `}>
        {messages.map((message, i) => {
          const isSelf = message.sender.address === user?.address
          
          return (
            <div
              key={i}
              css={css`
                display: flex;
                flex-direction: ${isSelf ? 'row-reverse' : 'row'};
                gap: 10px;
                align-items: flex-start;
              `}
            >
              <div css={css`
                width: 32px;
                height: 32px;
                border-radius: 50%;
                overflow: hidden;
                flex-shrink: 0;
              `}>
                <img
                  src={message.sender.picture || 'https://hyperfy.xyz/logo-icon.svg'}
                  alt={message.sender.name}
                  css={css`
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  `}
                />
              </div>
              
              <div css={css`
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-width: 70%;
              `}>
                <div css={css`
                  font-size: 12px;
                  color: rgba(255, 255, 255, 0.6);
                  ${isSelf ? 'text-align: right;' : ''}
                `}>
                  {message.sender.name || 'Anonymous'}
                </div>
                
                <div css={css`
                  background: ${isSelf ? '#551bf9' : 'rgba(0, 0, 0, 0.2)'};
                  color: white;
                  padding: 10px 15px;
                  border-radius: 12px;
                  font-size: 14px;
                  line-height: 1.4;
                  
                  ${isSelf ? `
                    border-bottom-right-radius: 4px;
                  ` : `
                    border-bottom-left-radius: 4px;
                  `}
                `}>
                  {message.content}
                </div>
                
                <div css={css`
                  font-size: 10px;
                  color: rgba(255, 255, 255, 0.4);
                  ${isSelf ? 'text-align: right;' : ''}
                `}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSend}
        css={css`
          display: flex;
          gap: 10px;
          padding: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        `}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          css={css`
            flex: 1;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 12px;
            color: white;
            font-size: 14px;
            
            &:focus {
              outline: none;
              border-color: #551bf9;
            }
            
            &::placeholder {
              color: rgba(255, 255, 255, 0.4);
            }
          `}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          css={css`
            background: #551bf9;
            border: none;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.15s ease-out;
            
            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            
            &:not(:disabled):hover {
              background: #6633ff;
            }
          `}
        >
          Send
        </button>
      </form>
    </div>
  )
} 