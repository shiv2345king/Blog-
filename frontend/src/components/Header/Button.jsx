import React from 'react'

function Button({
  children,
  type='button',
  bgColor='bg-blue-700',
  textColor='text-black',
  className='',
  ...props
}) {
  return (
    <div className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`}>
      {children}
    </div>
  )
}

export default Button
