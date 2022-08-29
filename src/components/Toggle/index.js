import React from 'react'

const Toggle = ({ value, onChange }) => (
  <>
    <div className="switch-container">
      <label htmlFor="toggler">
        <input 
          className='switch'
          id="toggler"
          type="checkbox"
          onClick={onChange}
          checked={value}
          readOnly />
        <div>
          <span className="wrg-toggle-uncheck" role='img' aria-label='sun'>☀️</span>
          <div></div>
          <span className="wrg-toggle-check" role='img' aria-label='moon'>🌒</span>
        </div>
      </label>
    </div>
  </>
)

export default Toggle;