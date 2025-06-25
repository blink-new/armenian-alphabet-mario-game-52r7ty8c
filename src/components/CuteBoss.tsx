import React from 'react'
import { motion } from 'framer-motion'

interface CuteBossProps {
  health?: number
  className?: string
}

const CuteBoss: React.FC<CuteBossProps> = ({ health = 3, className = "" }) => {
  const isAngry = health <= 1
  const isDamaged = health <= 2
  
  return (
    <div className={`relative ${className}`}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="60" cy="110" rx="25" ry="5" fill="#000000" opacity="0.2" />
        
        {/* Body (Չ character as main body) */}
        <g transform="translate(60,55)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-5xl font-bold fill-red-800"
            style={{ fontFamily: 'serif' }}
          >
            Չ
          </text>
        </g>
        
        {/* Menacing Face */}
        {/* Eyes */}
        <motion.g
          animate={{
            scaleX: isAngry ? 1.3 : 1,
            scaleY: isAngry ? 0.8 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <circle cx="50" cy="42" r="4" fill={isAngry ? "#dc2626" : "#1f2937"} />
          <circle cx="70" cy="42" r="4" fill={isAngry ? "#dc2626" : "#1f2937"} />
          {/* Eye shine */}
          <circle cx="51" cy="41" r="1.5" fill="white" />
          <circle cx="71" cy="41" r="1.5" fill="white" />
        </motion.g>
        
        {/* Angry eyebrows */}
        <motion.g
          animate={{
            y: isAngry ? -2 : 0,
            rotate: isAngry ? [-2, 2, -2] : 0
          }}
          transition={{ duration: 0.5, repeat: isAngry ? Infinity : 0 }}
        >
          <path d="M 45 36 L 52 38" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" />
          <path d="M 68 38 L 75 36" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
        
        {/* Mouth */}
        <motion.path
          d={isAngry 
            ? "M 50 58 Q 60 62 70 58"  // Angry frown
            : isDamaged 
            ? "M 52 58 Q 60 60 68 58"  // Worried expression
            : "M 54 58 Q 60 56 66 58"  // Neutral/slight frown
          }
          stroke="#991b1b"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{
            strokeWidth: isAngry ? [3, 4, 3] : 3
          }}
          transition={{ duration: 0.5, repeat: isAngry ? Infinity : 0 }}
        />
        
        {/* Teeth when angry */}
        {isAngry && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <polygon points="56,58 58,62 60,58" fill="white" />
            <polygon points="60,58 62,62 64,58" fill="white" />
          </motion.g>
        )}
        
        {/* Arms/Hands - more menacing */}
        <motion.g
          animate={{
            rotate: isAngry ? [-15, 15, -15] : [-5, 5, -5],
            y: isAngry ? [-3, 0, -3] : 0
          }}
          transition={{ 
            duration: isAngry ? 0.4 : 1.2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Left arm */}
          <line x1="35" y1="60" x2="20" y2="65" stroke="#7c2d12" strokeWidth="6" strokeLinecap="round" />
          {/* Left claw hand */}
          <g transform="translate(18,67)">
            <circle r="6" fill="#451a03" />
            <path d="M -3 -3 L 0 3 L 3 -3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          </g>
          
          {/* Right arm */}
          <line x1="85" y1="60" x2="100" y2="65" stroke="#7c2d12" strokeWidth="6" strokeLinecap="round" />
          {/* Right claw hand */}
          <g transform="translate(102,67)">
            <circle r="6" fill="#451a03" />
            <path d="M -3 -3 L 0 3 L 3 -3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          </g>
        </motion.g>
        
        {/* Legs - more sturdy */}
        <motion.g
          animate={{
            y: [0, -2, 0],
            scaleY: [1, 0.95, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Left leg */}
          <line x1="50" y1="75" x2="45" y2="95" stroke="#7c2d12" strokeWidth="7" strokeLinecap="round" />
          {/* Left foot */}
          <ellipse cx="42" cy="98" rx="8" ry="4" fill="#451a03" />
          
          {/* Right leg */}
          <line x1="70" y1="75" x2="75" y2="95" stroke="#7c2d12" strokeWidth="7" strokeLinecap="round" />
          {/* Right foot */}
          <ellipse cx="78" cy="98" rx="8" ry="4" fill="#451a03" />
        </motion.g>
        
        {/* Crown/Horns */}
        <g transform="translate(60,25)">
          <path d="M -15 0 L -8 -8 L 0 -5 L 8 -8 L 15 0" 
                fill="#7c2d12" stroke="#451a03" strokeWidth="2" />
          <circle cx="0" cy="-3" r="3" fill="#dc2626" />
        </g>
        
        {/* Health indicator hearts */}
        <g transform="translate(10,10)">
          {Array.from({ length: 3 }, (_, i) => (
            <g key={i} transform={`translate(${i * 25},0)`}>
              <motion.path
                d="M 0 5 C 0 2, 3 0, 6 3 C 9 0, 12 2, 12 5 C 12 8, 6 12, 6 12 C 6 12, 0 8, 0 5 Z"
                fill={i < health ? "#dc2626" : "#6b7280"}
                animate={{
                  scale: i < health ? [1, 1.1, 1] : 1,
                  opacity: i < health ? 1 : 0.3
                }}
                transition={{ duration: 0.5, repeat: i < health ? Infinity : 0 }}
              />
            </g>
          ))}
        </g>
        
        {/* Anger steam when damaged */}
        {isDamaged && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <circle cx="45" cy="30" r="2" fill="#fbbf24" />
            <circle cx="75" cy="30" r="2" fill="#fbbf24" />
            <circle cx="50" cy="25" r="1.5" fill="#fbbf24" />
            <circle cx="70" cy="25" r="1.5" fill="#fbbf24" />
          </motion.g>
        )}
        
        {/* Boss aura effect */}
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          opacity="0.3"
          animate={{
            r: [45, 55, 45],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </div>
  )
}

export default CuteBoss