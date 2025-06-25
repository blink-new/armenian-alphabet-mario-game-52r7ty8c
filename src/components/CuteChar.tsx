import React from 'react'
import { motion } from 'framer-motion'

interface CuteCharProps {
  isJumping?: boolean
  className?: string
}

const CuteChar: React.FC<CuteCharProps> = ({ isJumping = false, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body (Ճ character as main body) */}
        <g transform="translate(40,35)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-3xl font-bold fill-red-600"
            style={{ fontFamily: 'serif' }}
          >
            Ճ
          </text>
        </g>
        
        {/* Cute Face */}
        {/* Eyes */}
        <circle cx="34" cy="28" r="3" fill="#1f2937" />
        <circle cx="46" cy="28" r="3" fill="#1f2937" />
        {/* Eye shine */}
        <circle cx="35" cy="27" r="1" fill="white" />
        <circle cx="47" cy="27" r="1" fill="white" />
        
        {/* Mouth */}
        <motion.path
          d="M 36 38 Q 40 42 44 38"
          stroke="#1f2937"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: isJumping 
              ? "M 36 38 Q 40 44 44 38"  // Excited expression when jumping
              : "M 36 38 Q 40 42 44 38"   // Normal smile
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Cheek blush */}
        <ellipse cx="28" cy="32" rx="3" ry="2" fill="#fca5a5" opacity="0.6" />
        <ellipse cx="52" cy="32" rx="3" ry="2" fill="#fca5a5" opacity="0.6" />
        
        {/* Arms/Hands */}
        <motion.g
          animate={{
            rotate: isJumping ? [-10, 10, -10] : 0,
            y: isJumping ? [-2, 0, -2] : 0
          }}
          transition={{ duration: 0.6, repeat: isJumping ? Infinity : 0 }}
        >
          {/* Left arm */}
          <line x1="25" y1="40" x2="15" y2="45" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
          {/* Left hand */}
          <circle cx="13" cy="47" r="4" fill="#fbbf24" />
          
          {/* Right arm */}
          <line x1="55" y1="40" x2="65" y2="45" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
          {/* Right hand */}
          <circle cx="67" cy="47" r="4" fill="#fbbf24" />
        </motion.g>
        
        {/* Legs */}
        <motion.g
          animate={{
            rotate: isJumping ? 0 : [0, -2, 2, 0],
            y: isJumping ? 0 : [0, 1, 0]
          }}
          transition={{ 
            duration: isJumping ? 0 : 1.5, 
            repeat: isJumping ? 0 : Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Left leg */}
          <line x1="35" y1="50" x2="30" y2="65" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" />
          {/* Left foot */}
          <ellipse cx="28" cy="67" rx="6" ry="3" fill="#dc2626" />
          
          {/* Right leg */}
          <line x1="45" y1="50" x2="50" y2="65" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" />
          {/* Right foot */}
          <ellipse cx="52" cy="67" rx="6" ry="3" fill="#dc2626" />
        </motion.g>
        
        {/* Hat (optional cute detail) */}
        <ellipse cx="40" cy="20" rx="15" ry="8" fill="#ef4444" />
        <ellipse cx="40" cy="18" rx="12" ry="6" fill="#dc2626" />
        <text
          x="40"
          y="22"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-bold fill-white"
        >
          Ճ
        </text>
        
        {/* Movement effect particles when jumping */}
        {isJumping && (
          <g>
            <motion.circle
              cx="20"
              cy="60"
              r="2"
              fill="#fbbf24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [-5, -15] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            <motion.circle
              cx="60"
              cy="58"
              r="2"
              fill="#fbbf24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [-5, -15] }}
              transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
            />
            <motion.circle
              cx="40"
              cy="62"
              r="1.5"
              fill="#8b5cf6"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [-3, -12] }}
              transition={{ duration: 0.6, delay: 0.4, repeat: Infinity }}
            />
          </g>
        )}
      </svg>
    </div>
  )
}

export default CuteChar