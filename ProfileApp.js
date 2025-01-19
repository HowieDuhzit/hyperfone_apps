/*
{
  "name": "Profile",
  "description": "View and manage your Hyperfy profile",
  "version": "1.0.0",
  "author": "Hyperfy",
  "icon": "👤",
  "category": "Social",
  "permissions": [
    "storage",
    "network",
    "camera",
    "user.profile"
  ],
  "dependencies": {
    "@firebolt-dev/css": "^1.0.0"
  },
  "minOSVersion": "1.0.0",
  "supportedDevices": ["all"],
  "apiEndpoints": [
    "https://api.hyperfy.io/profile",
    "https://api.hyperfy.io/avatar"
  ]
}
*/
import { css } from '@firebolt-dev/css'
import { useState } from 'react'

export function ProfileApp({ 
  playerName, setPlayerName,
  playerBio, setPlayerBio,
  playerPicture, setPlayerPicture,
  playerGender, setPlayerGender,
  bloodType, setBloodType,
  playerStats, setPlayerStats,
  isEditingProfile, setIsEditingProfile,
  saveProfile
}) {
  // Calculate total points for profile stats
  const calculateTotalPoints = (stats) => {
    if (!stats) return 0
    return Object.values(stats).reduce((sum, value) => sum + parseInt(value || 0), 0)
  }

  return (
    <div css={css`
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 10px;
    `}>
      <div css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
      `}>
        <h3 css={css`
          margin: 0;
          color: white;
          font-size: 18px;
        `}>
          Player Profile
        </h3>
        <button
          css={css`
            background: none;
            border: none;
            color: #551bf9;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.15s ease-out;
            &:hover {
              background: rgba(85, 27, 249, 0.1);
            }
          `}
          onClick={() => setIsEditingProfile(!isEditingProfile)}
        >
          {isEditingProfile ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Profile Content */}
      <div css={css`
        display: flex;
        gap: 20px;
        align-items: flex-start;
      `}>
        {/* Profile Picture Column */}
        <div css={css`
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
          width: 120px;
        `}>
          <div css={css`
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(85, 27, 249, 0.3);
          `}>
            <img 
              src={playerPicture} 
              alt="Profile"
              css={css`
                width: 100%;
                height: 100%;
                object-fit: cover;
              `}
            />
          </div>

          {isEditingProfile && (
            <>
              <input
                type="text"
                value={playerPicture}
                onChange={(e) => setPlayerPicture(e.target.value)}
                placeholder="Enter image URL"
                css={css`
                  width: 100%;
                  background: rgba(0, 0, 0, 0.2);
                  border: none;
                  border-radius: 8px;
                  padding: 4px 8px;
                  color: white;
                  font-size: 10px;
                  text-align: center;
                  &:focus {
                    outline: none;
                    border-color: #551bf9;
                  }
                `}
              />
              <button
                css={css`
                  background: none;
                  border: none;
                  color: #551bf9;
                  font-size: 12px;
                  cursor: pointer;
                  padding: 4px;
                  &:hover {
                    text-decoration: underline;
                  }
                `}
                onClick={() => setPlayerPicture('https://hyperfy.xyz/logo-icon.svg')}
              >
                Reset to Default
              </button>
            </>
          )}
        </div>

        {/* Profile Info */}
        <div css={css`
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 15px;
        `}>
          {/* Display Name */}
          <div css={css`
            display: flex;
            flex-direction: column;
            gap: 5px;
          `}>
            <label css={css`
              color: rgba(255, 255, 255, 0.6);
              font-size: 12px;
            `}>
              Display Name
            </label>
            {isEditingProfile ? (
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your display name"
                css={css`
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
                `}
              />
            ) : (
              <div css={css`
                color: white;
                font-size: 16px;
                background: rgba(0, 0, 0, 0.2);
                padding: 12px;
                border-radius: 8px;
              `}>
                {playerName || 'Anonymous Player'}
              </div>
            )}
          </div>

          {/* Gender Selection */}
          <div css={css`
            display: flex;
            flex-direction: column;
            gap: 5px;
          `}>
            <label css={css`
              color: rgba(255, 255, 255, 0.6);
              font-size: 12px;
            `}>
              Gender
            </label>
            {isEditingProfile ? (
              <div css={css`
                display: flex;
                gap: 10px;
              `}>
                {['male', 'female'].map(gender => (
                  <button
                    key={gender}
                    css={css`
                      flex: 1;
                      padding: 8px;
                      background: ${playerGender === gender ? 'rgba(85, 27, 249, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
                      border: 1px solid ${playerGender === gender ? '#551bf9' : 'rgba(255, 255, 255, 0.1)'};
                      border-radius: 8px;
                      color: white;
                      cursor: pointer;
                      text-transform: capitalize;
                      &:hover {
                        background: rgba(85, 27, 249, 0.2);
                      }
                    `}
                    onClick={() => setPlayerGender(gender)}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            ) : (
              <div css={css`
                color: white;
                font-size: 14px;
                background: rgba(0, 0, 0, 0.2);
                padding: 12px;
                border-radius: 8px;
                text-transform: capitalize;
              `}>
                {playerGender}
              </div>
            )}
          </div>

          {/* Blood Type Selection */}
          <div css={css`
            display: flex;
            flex-direction: column;
            gap: 5px;
          `}>
            <label css={css`
              color: rgba(255, 255, 255, 0.6);
              font-size: 12px;
            `}>
              Blood Type
            </label>
            {isEditingProfile ? (
              <div css={css`
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 5px;
              `}>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => (
                  <button
                    key={type}
                    css={css`
                      padding: 8px;
                      background: ${bloodType === type ? 'rgba(85, 27, 249, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
                      border: 1px solid ${bloodType === type ? '#551bf9' : 'rgba(255, 255, 255, 0.1)'};
                      border-radius: 8px;
                      color: white;
                      cursor: pointer;
                      &:hover {
                        background: rgba(85, 27, 249, 0.2);
                      }
                    `}
                    onClick={() => setBloodType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            ) : (
              <div css={css`
                color: white;
                font-size: 14px;
                background: rgba(0, 0, 0, 0.2);
                padding: 12px;
                border-radius: 8px;
              `}>
                {bloodType || 'Not Set'}
              </div>
            )}
          </div>

          {/* Player Stats */}
          <div css={css`
            display: flex;
            flex-direction: column;
            gap: 5px;
          `}>
            <label css={css`
              color: rgba(255, 255, 255, 0.6);
              font-size: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}>
              Player Stats
              <span css={css`
                font-size: 10px;
                color: ${calculateTotalPoints(playerStats) > 36 ? '#ff4444' : 'rgba(255, 255, 255, 0.6)'};
              `}>
                Points: {calculateTotalPoints(playerStats)}/36
              </span>
            </label>
            <div css={css`
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              background: rgba(0, 0, 0, 0.2);
              padding: 15px;
              border-radius: 8px;
            `}>
              {Object.entries(playerStats).map(([stat, value]) => (
                <div key={stat} css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 6px;
                `}>
                  <div css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  `}>
                    <div css={css`
                      font-size: 12px;
                      color: rgba(255, 255, 255, 0.8);
                      text-transform: capitalize;
                    `}>
                      {stat.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div css={css`
                      font-size: 12px;
                      color: rgba(255, 255, 255, 0.6);
                    `}>
                      {value}/10
                    </div>
                  </div>
                  {isEditingProfile ? (
                    <div css={css`position: relative;`}>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={value}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value)
                          const currentTotal = calculateTotalPoints(playerStats)
                          const otherStats = Object.entries(playerStats)
                            .filter(([s]) => s !== stat)
                            .reduce((sum, [_, v]) => sum + parseInt(v), 0)
                          
                          // Only allow change if total points would not exceed 36
                          if (otherStats + newValue <= 36) {
                            setPlayerStats(prev => ({
                              ...prev,
                              [stat]: newValue
                            }))
                          }
                        }}
                        css={css`
                          width: 100%;
                          -webkit-appearance: none;
                          background: rgba(85, 27, 249, 0.2);
                          height: 4px;
                          border-radius: 2px;
                          &::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            background: #551bf9;
                            cursor: pointer;
                            border: 2px solid rgba(255, 255, 255, 0.2);
                            transition: all 0.15s ease-out;
                            &:hover {
                              transform: scale(1.2);
                              background: #6633ff;
                            }
                          }
                        `}
                      />
                      <div css={css`
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: ${(value / 10) * 100}%;
                        height: 4px;
                        background: #551bf9;
                        border-radius: 2px;
                        pointer-events: none;
                      `} />
                    </div>
                  ) : (
                    <div css={css`
                      width: 100%;
                      height: 4px;
                      background: rgba(85, 27, 249, 0.2);
                      border-radius: 2px;
                      position: relative;
                      &:after {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: 100%;
                        width: ${(value / 10) * 100}%;
                        background: #551bf9;
                        border-radius: 2px;
                      }
                    `} />
                  )}
                </div>
              ))}
            </div>
            {isEditingProfile && calculateTotalPoints(playerStats) > 36 && (
              <div css={css`
                color: #ff4444;
                font-size: 12px;
                text-align: center;
                margin-top: 5px;
              `}>
                Total points cannot exceed 36
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div css={css`
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-top: 10px;
          `}>
            <label css={css`
              color: rgba(255, 255, 255, 0.6);
              font-size: 12px;
            `}>
              Bio
            </label>
            {isEditingProfile ? (
              <textarea
                value={playerBio}
                onChange={(e) => setPlayerBio(e.target.value)}
                placeholder="Tell us about yourself"
                css={css`
                  background: rgba(0, 0, 0, 0.2);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 8px;
                  padding: 12px;
                  color: white;
                  font-size: 14px;
                  min-height: 80px;
                  resize: vertical;
                  &:focus {
                    outline: none;
                    border-color: #551bf9;
                  }
                `}
              />
            ) : (
              <div css={css`
                color: white;
                font-size: 14px;
                background: rgba(0, 0, 0, 0.2);
                padding: 12px;
                border-radius: 8px;
                min-height: 80px;
                white-space: pre-wrap;
              `}>
                {playerBio || 'No bio set'}
              </div>
            )}
          </div>

          {isEditingProfile && (
            <button
              css={css`
                background: ${calculateTotalPoints(playerStats) > 36 ? '#ff4444' : '#551bf9'};
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px;
                font-size: 14px;
                cursor: ${calculateTotalPoints(playerStats) > 36 ? 'not-allowed' : 'pointer'};
                transition: all 0.15s ease-out;
                opacity: ${calculateTotalPoints(playerStats) > 36 ? 0.5 : 1};
                &:hover {
                  background: ${calculateTotalPoints(playerStats) > 36 ? '#ff4444' : '#6633ff'};
                }
              `}
              onClick={saveProfile}
              disabled={calculateTotalPoints(playerStats) > 36}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 