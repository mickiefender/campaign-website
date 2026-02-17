'use client'

import Image from 'next/image'

export default function RouteLoader() {
  return (
    <div className="loader-container">
      <div className="loader-content">
        {/* Placeholder spinner - will be replaced with your loader image */}
        <div className="relative w-20 h-20">
          <div className="loader-image">
    <Image
      src="/image/elephant_loader.png"
      alt="Loading"
      width={100}
      height={100}
      className="w-full h-full"
    />
  </div>
        </div>
        <p className="text-white text-lg font-semibold animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

/* 
  To use a custom loader image instead of the SVG, replace the SVG section with:
  
  <div className="loader-image">
    <Image
      src="/path/to/your/loader.png"
      alt="Loading"
      width={80}
      height={80}
      className="w-full h-full"
    />
  </div>
  
  Then update the CSS in globals.css to adjust the animation accordingly.
*/
