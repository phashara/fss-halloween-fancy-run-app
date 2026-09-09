import React from 'react';

interface GhostAvatarProps {
  code: string;
  className?: string;
  size?: number;
  isScary?: boolean;
}

export const GhostAvatar: React.FC<GhostAvatarProps> = ({ 
  code, 
  className = '', 
  size = 120, 
  isScary = true 
}) => {
  // If Scary/Horror Mode is active, render the spine-chilling horror illustrations!
  if (isScary) {
    switch (code) {
      case 'G01': // กระสือไส้โชกเลือด (Bloody Viscera Krasue)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="krasue-blood-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#7f1d1d" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="viscera-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#b91c1c" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>
            {/* Ominous blood aura */}
            <circle cx="80" cy="80" r="76" fill="url(#krasue-blood-glow)" />
            {/* Floating embers & ghost flames */}
            <circle cx="28" cy="45" r="2.5" fill="#f87171" opacity="0.8" />
            <circle cx="132" cy="50" r="3" fill="#ef4444" opacity="0.7" />
            <circle cx="35" cy="115" r="2" fill="#ff0055" />
            <circle cx="125" cy="120" r="2.5" fill="#ff0055" />

            {/* Severed Neck & Dangling Bloody Spinal Cord */}
            <path d="M76 82 L76 112 M84 82 L84 112" stroke="#7f1d1d" strokeWidth="4" strokeLinecap="round" />
            <rect x="74" y="85" width="12" height="4" rx="1.5" fill="#f8fafc" />
            <rect x="74" y="93" width="12" height="4" rx="1.5" fill="#f8fafc" />
            <rect x="75" y="101" width="10" height="4" rx="1.5" fill="#f8fafc" />

            {/* Pulsing Intestines & Organs dripping blood */}
            <path d="M68 108 C50 115 52 135 72 136 C92 137 90 120 74 124 C60 128 65 145 82 146 C98 147 106 130 94 118 C85 110 75 106 68 108 Z" 
              fill="url(#viscera-grad)" stroke="#450a0a" strokeWidth="2.5" />
            
            {/* Pulsating heart with dark aorta */}
            <path d="M84 106 C80 98 96 95 98 105 C100 114 88 122 84 122 C80 122 72 114 74 105 C76 95 90 98 84 106 Z" 
              fill="#991b1b" stroke="#450a0a" strokeWidth="1.5" />
            
            {/* Dripping Blood Droplets */}
            <path d="M72 138 Q70 148 70 152 Q72 154 74 152 Q74 148 72 138 Z" fill="#dc2626" />
            <path d="M88 142 Q86 150 86 155 Q88 157 90 155 Q90 150 88 142 Z" fill="#ef4444" />
            <circle cx="80" cy="156" r="2" fill="#ef4444" />

            {/* Wild Flying Ragged Hair */}
            <path d="M30 65 C18 30 55 12 80 12 C105 12 142 30 130 65 C136 82 128 100 122 85 C118 70 115 50 80 46 C45 50 42 70 38 85 C32 100 24 82 30 65 Z" fill="#090a0f" />
            <path d="M38 72 Q20 90 28 105 Q35 95 44 80 Z" fill="#0f172a" />
            <path d="M122 72 Q140 90 132 105 Q125 95 116 80 Z" fill="#0f172a" />

            {/* Ghastly Corpse-Pale Head */}
            <ellipse cx="80" cy="56" rx="29" ry="31" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />

            {/* Sunken Veins & Bruises */}
            <path d="M56 46 Q64 50 68 54 M104 46 Q96 50 92 54" stroke="#64748b" strokeWidth="1.2" opacity="0.6" />

            {/* Hollow Bleeding Demonic Eyes */}
            <ellipse cx="68" cy="52" rx="7" ry="8" fill="#1e1b4b" stroke="#7f1d1d" strokeWidth="1.5" />
            <circle cx="68" cy="52" r="3.5" fill="#ef4444" />
            <circle cx="68" cy="52" r="1.5" fill="#ffffff" />
            {/* Blood tears */}
            <path d="M68 60 L67 74 L69 74 Z" fill="#991b1b" />

            <ellipse cx="92" cy="52" rx="7" ry="8" fill="#1e1b4b" stroke="#7f1d1d" strokeWidth="1.5" />
            <circle cx="92" cy="52" r="3.5" fill="#ef4444" />
            <circle cx="92" cy="52" r="1.5" fill="#ffffff" />
            {/* Blood tears */}
            <path d="M92 60 L93 76 L91 76 Z" fill="#991b1b" />

            {/* Nose cavity */}
            <path d="M78 61 L80 57 L82 61 Z" fill="#334155" />

            {/* Sinister Mouth with Sharp Predatory Fangs and Blood Drip */}
            <path d="M66 70 Q80 84 94 70 Q80 73 66 70 Z" fill="#450a0a" stroke="#7f1d1d" strokeWidth="1.5" />
            {/* Upper fangs */}
            <polygon points="72,71 74,77 76,71" fill="#f8fafc" />
            <polygon points="84,71 86,77 88,71" fill="#f8fafc" />
            {/* Lower fangs */}
            <polygon points="78,79 80,74 82,79" fill="#f8fafc" />
            {/* Blood on chin */}
            <path d="M78 78 Q80 86 80 88" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'G02': // กระหังทมิฬกรงเล็บพิษ (Dark Claw Krahang)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="krahang-dark-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0369a1" stopOpacity="0.6" />
                <stop offset="80%" stopColor="#0f172a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#krahang-dark-glow)" />

            {/* Giant Jagged Demon Winnowing Baskets (Spiked Wing Baskets) */}
            <path d="M12 40 C6 75 18 110 38 120 C46 95 44 65 30 45 Z" fill="#1c1917" stroke="#78350f" strokeWidth="2" />
            <path d="M14 60 L36 75 M16 85 L38 95 M22 45 L32 105" stroke="#b45309" strokeWidth="1.5" opacity="0.8" />
            <path d="M10 50 L4 52 L12 65 M12 80 L6 85 L16 95" stroke="#dc2626" strokeWidth="2" /> {/* Spikes & blood */}

            <path d="M148 40 C154 75 142 110 122 120 C114 95 116 65 130 45 Z" fill="#1c1917" stroke="#78350f" strokeWidth="2" />
            <path d="M146 60 L124 75 M144 85 L122 95 M138 45 L128 105" stroke="#b45309" strokeWidth="1.5" opacity="0.8" />
            <path d="M150 50 L156 52 L148 65 M148 80 L154 85 L144 95" stroke="#dc2626" strokeWidth="2" />

            {/* Muscular Demonic Body */}
            <path d="M60 85 C55 125 65 145 80 145 C95 145 105 125 100 85 Z" fill="#1e293b" />
            <path d="M65 115 Q80 135 95 115" stroke="#dc2626" strokeWidth="2" /> {/* Cursed loincloth belt */}
            <polygon points="76,115 80,135 84,115" fill="#991b1b" />

            {/* Muscular Clawed Arms */}
            <path d="M60 88 Q35 90 32 102" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M30 100 L24 104 M31 103 L26 109 M34 105 L30 112" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" /> {/* Sharp claws */}

            <path d="M100 88 Q125 90 128 102" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M130 100 L136 104 M129 103 L134 109 M126 105 L130 112" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />

            {/* Demonic Head with Cursed Topknot */}
            <circle cx="80" cy="58" r="25" fill="#334155" stroke="#0f172a" strokeWidth="2" />
            <path d="M62 48 Q80 35 98 48 Z" fill="#090a0f" />
            <ellipse cx="80" cy="34" rx="8" ry="12" fill="#090a0f" />
            <circle cx="80" cy="40" r="4" fill="#dc2626" />

            {/* Glowing Feral Yellow-Red Slit Eyes */}
            <polygon points="65,54 75,52 74,58 64,57" fill="#020617" />
            <ellipse cx="69" cy="55" rx="3.5" ry="2" fill="#facc15" />
            <line x1="69" y1="53" x2="69" y2="57" stroke="#dc2626" strokeWidth="1.5" />

            <polygon points="95,54 85,52 86,58 96,57" fill="#020617" />
            <ellipse cx="91" cy="55" rx="3.5" ry="2" fill="#facc15" />
            <line x1="91" y1="53" x2="91" y2="57" stroke="#dc2626" strokeWidth="1.5" />

            {/* Menacing Demonic Grin with Sharp Teeth */}
            <path d="M70 66 Q80 76 90 66 Z" fill="#450a0a" stroke="#020617" strokeWidth="1.5" />
            <path d="M72 67 L74 72 L76 67 M78 68 L80 73 L82 68 M84 68 L86 73 L88 67" stroke="#f8fafc" strokeWidth="1.5" />

            {/* Flying Cursed Pestle (สากหินอาถรรพ์) dripping blood */}
            <path d="M72 138 L88 152" stroke="#475569" strokeWidth="9" strokeLinecap="round" />
            <circle cx="88" cy="152" r="3" fill="#ef4444" />
          </svg>
        );

      case 'G03': // นางตานีอาฆาตแค้น (Vengeful Nang Tani)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="tani-green-mist" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#047857" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#064e3b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#tani-green-mist)" />

            {/* Shredded Rotting Banana Leaves in Shadows */}
            <path d="M22 35 C38 15 85 10 75 40 C60 42 35 48 22 35 Z" fill="#064e3b" stroke="#022c22" strokeWidth="1.5" />
            <path d="M138 35 C122 15 75 10 85 40 C100 42 125 48 138 35 Z" fill="#064e3b" stroke="#022c22" strokeWidth="1.5" />
            <line x1="28" y1="36" x2="68" y2="28" stroke="#052e16" strokeWidth="1.5" />
            <line x1="132" y1="36" x2="92" y2="28" stroke="#052e16" strokeWidth="1.5" />

            {/* Long Wild Tangled Wet Black Hair */}
            <path d="M42 45 C30 90 35 145 46 152 C55 130 52 90 48 65 Z" fill="#020617" />
            <path d="M118 45 C130 90 125 145 114 152 C105 130 108 90 112 65 Z" fill="#020617" />

            {/* Bloodstained Torn Emerald Sash (สไบขาดวิ่นเปรอะเลือด) */}
            <path d="M60 85 L102 125 L92 152 L56 142 Z" fill="#064e3b" />
            <path d="M64 88 Q80 94 98 86 L94 112 Q80 118 62 108 Z" fill="#047857" />
            {/* Blood stains on sash */}
            <circle cx="74" cy="118" r="7" fill="#7f1d1d" opacity="0.8" />
            <circle cx="85" cy="132" r="5" fill="#991b1b" opacity="0.75" />

            {/* Corpselike Pale Green Skin */}
            <circle cx="80" cy="58" r="26" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />

            {/* Front strands of wet hair covering half of face */}
            <path d="M54 50 Q66 75 60 100 Q56 80 52 65 Z" fill="#020617" />
            <path d="M106 50 Q96 70 102 95 Q106 75 108 65 Z" fill="#020617" />
            <path d="M58 45 Q80 34 102 45 Z" fill="#020617" />

            {/* Wilted, Decayed Yellow Champa Flower with Blood drip */}
            <circle cx="106" cy="46" r="6" fill="#854d0e" />
            <circle cx="106" cy="46" r="3" fill="#7f1d1d" />

            {/* Haunting Void Glowing Cyan/White Eyes (Pupil-less) */}
            <ellipse cx="71" cy="56" rx="5" ry="6" fill="#022c22" />
            <ellipse cx="71" cy="56" rx="4" ry="4" fill="#a7f3d0" />
            <circle cx="71" cy="56" r="1.5" fill="#ffffff" />
            {/* Black tears */}
            <path d="M71 62 L70 76" stroke="#022c22" strokeWidth="2" strokeLinecap="round" />

            <ellipse cx="89" cy="56" rx="5" ry="6" fill="#022c22" />
            <ellipse cx="89" cy="56" rx="4" ry="4" fill="#a7f3d0" />
            <circle cx="89" cy="56" r="1.5" fill="#ffffff" />
            <path d="M89 62 L90 78" stroke="#022c22" strokeWidth="2" strokeLinecap="round" />

            {/* Creepy Stitched / Sinister Smirk */}
            <path d="M72 74 Q80 82 88 74" stroke="#064e3b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <line x1="75" y1="73" x2="75" y2="77" stroke="#022c22" strokeWidth="1.5" />
            <line x1="80" y1="74" x2="80" y2="79" stroke="#022c22" strokeWidth="1.5" />
            <line x1="85" y1="73" x2="85" y2="77" stroke="#022c22" strokeWidth="1.5" />

            {/* Skeletal Hands with 3-inch black talons reaching out */}
            <path d="M42 98 Q55 105 58 112" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round" />
            <line x1="58" y1="112" x2="65" y2="116" stroke="#022c22" strokeWidth="2" />
          </svg>
        );

      case 'G04': // ผีกองกอยดูดเลือดสด (Vampiric Phi Kong Goyi)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="goyi-swamp-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#b45309" stopOpacity="0.7" />
                <stop offset="80%" stopColor="#451a03" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1c1917" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#goyi-swamp-glow)" />

            {/* Single Bony Crooked Leg with Hooked Talons */}
            <path d="M80 108 L80 138 L72 148" stroke="#78716c" strokeWidth="8" strokeLinecap="round" />
            {/* Hooked claws */}
            <path d="M72 148 L60 152 M72 148 L64 156 M72 148 L72 158" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
            <circle cx="62" cy="152" r="2" fill="#ef4444" />

            {/* Wrinkled Shriveled Goblin Body */}
            <ellipse cx="80" cy="94" rx="22" ry="24" fill="#57534e" stroke="#292524" strokeWidth="1.5" />
            <path d="M70 92 Q80 102 90 92" stroke="#dc2626" strokeWidth="1.5" /> {/* blood on chest */}

            {/* Pointed Demon Ears */}
            <polygon points="54,58 35,50 50,68" fill="#57534e" stroke="#292524" strokeWidth="1.5" />
            <polygon points="106,58 125,50 110,68" fill="#57534e" stroke="#292524" strokeWidth="1.5" />

            {/* Wrinkled Ghoul Head */}
            <circle cx="80" cy="62" r="26" fill="#78716c" stroke="#292524" strokeWidth="2" />
            {/* Forehead wrinkles */}
            <path d="M68 48 Q80 44 92 48 M70 53 Q80 50 90 53" stroke="#44403c" strokeWidth="1.5" />

            {/* Burning Crimson Feral Eyes */}
            <ellipse cx="70" cy="60" rx="6" ry="6" fill="#450a0a" />
            <circle cx="70" cy="60" r="3" fill="#ef4444" />
            <circle cx="70" cy="60" r="1.2" fill="#fef08a" />

            <ellipse cx="90" cy="60" rx="6" ry="6" fill="#450a0a" />
            <circle cx="90" cy="60" r="3" fill="#ef4444" />
            <circle cx="90" cy="60" r="1.2" fill="#fef08a" />

            {/* Predator Gaping Mouth with Long Blood-Dripping Fangs */}
            <path d="M68 72 Q80 90 92 72 Z" fill="#1c1917" stroke="#7f1d1d" strokeWidth="2" />
            {/* Long upper fangs dripping blood */}
            <polygon points="72,72 75,86 78,72" fill="#f8fafc" />
            <polygon points="82,72 85,86 88,72" fill="#f8fafc" />
            <circle cx="75" cy="87" r="1.5" fill="#ef4444" />
            <circle cx="85" cy="87" r="1.5" fill="#ef4444" />

            {/* Sharp lower fangs */}
            <polygon points="77,88 80,82 83,88" fill="#f8fafc" />

            {/* Claws reaching forward */}
            <path d="M58 84 Q42 80 38 90" stroke="#78716c" strokeWidth="5" strokeLinecap="round" />
            <line x1="38" y1="90" x2="32" y2="92" stroke="#1c1917" strokeWidth="2" />
            <path d="M102 84 Q118 80 122 90" stroke="#78716c" strokeWidth="5" strokeLinecap="round" />
            <line x1="122" y1="90" x2="128" y2="92" stroke="#1c1917" strokeWidth="2" />
          </svg>
        );

      case 'G05': // แม่นากเฮี้ยนตายทั้งกลม (Vengeful Mae Nak)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="maenak-mist" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#831843" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#4c0519" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#maenak-mist)" />

            {/* Unnaturally Elongated Skeletal Arm (แขนยืด 10 เมตร) */}
            <path d="M96 82 Q145 60 152 42" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
            {/* Skeletal Bony Fingers Reaching Out */}
            <path d="M152 42 L158 35 M152 42 L160 40 M152 42 L159 46 M152 42 L155 50" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Tattered Burial Shroud Dress with Bloodstains */}
            <path d="M58 85 L102 85 L96 148 L62 148 Z" fill="#312e81" />
            <path d="M62 86 L94 116 L86 142 L60 108 Z" fill="#4c0519" />
            <circle cx="78" cy="120" r="10" fill="#7f1d1d" opacity="0.8" />

            {/* Dead Infant Swaddled in Cloth on left arm (ลูกตายทั้งกลม) */}
            <ellipse cx="48" cy="105" rx="14" ry="18" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="48" cy="96" r="8" fill="#64748b" />
            {/* Infant red glowing pinpoint eyes */}
            <circle cx="46" cy="96" r="1.5" fill="#ef4444" />
            <circle cx="50" cy="96" r="1.5" fill="#ef4444" />
            <path d="M44 108 Q48 114 52 108" stroke="#991b1b" strokeWidth="1.5" />

            {/* Long wild unkept black hair blowing in ghost wind */}
            <path d="M45 45 C30 85 36 135 48 145 C56 120 54 80 50 60 Z" fill="#020617" />
            <path d="M115 45 C130 85 124 135 112 145 C104 120 106 80 110 60 Z" fill="#020617" />

            {/* Gaunt Corpselike Head */}
            <ellipse cx="80" cy="58" rx="25" ry="29" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />

            {/* Hair bangs */}
            <path d="M56 46 Q80 34 104 46 Q100 36 80 36 Q60 36 56 46 Z" fill="#020617" />

            {/* Hollow Deep Black Eye Sockets with Burning Red Pinpoints */}
            <ellipse cx="71" cy="56" rx="6" ry="8" fill="#020617" />
            <circle cx="71" cy="56" r="2" fill="#ef4444" />
            <circle cx="71" cy="56" r="0.8" fill="#fff" />
            {/* Dried black blood weeping */}
            <path d="M71 64 L70 78" stroke="#450a0a" strokeWidth="2" />

            <ellipse cx="89" cy="56" rx="6" ry="8" fill="#020617" />
            <circle cx="89" cy="56" r="2" fill="#ef4444" />
            <circle cx="89" cy="56" r="0.8" fill="#fff" />
            <path d="M89 64 L90 78" stroke="#450a0a" strokeWidth="2" />

            {/* Sunken, agape mouth with blood trickle */}
            <path d="M74 74 Q80 84 86 74 Z" fill="#090a0f" stroke="#7f1d1d" strokeWidth="1.5" />
            <path d="M80 80 L80 88" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'G06': // เปรตขุมนรกโหยหวน (Hellfire Tall Pret)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="pret-hell-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#3b0764" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#18022b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#pret-hell-glow)" />

            {/* Emaciated Towering Legs (ยาวเสียดฟ้า) */}
            <path d="M74 70 L64 112 L45 152" stroke="#6b21a8" strokeWidth="6" strokeLinecap="round" />
            <path d="M86 70 L96 112 L115 152" stroke="#6b21a8" strokeWidth="6" strokeLinecap="round" />

            {/* Towering Thin Skeletal Torso & Exposed Ribcage */}
            <rect x="74" y="32" width="12" height="42" rx="6" fill="#581c87" />
            <path d="M70 42 L90 42 M71 48 L89 48 M72 54 L88 54 M73 60 L87 60" stroke="#c084fc" strokeWidth="1.5" />

            {/* Giant Banana-leaf Palm Hands (มือใหญ่เท่าใบลาน) dripping with Hell Chains */}
            <path d="M74 38 Q45 42 30 55" stroke="#6b21a8" strokeWidth="4" strokeLinecap="round" />
            <path d="M22 48 C16 65 24 85 36 82 C44 75 42 55 28 50 Z" fill="#7e22ce" stroke="#3b0764" strokeWidth="1.5" />
            {/* Iron chain */}
            <ellipse cx="26" cy="85" rx="3" ry="5" stroke="#facc15" strokeWidth="1.5" fill="none" />
            <ellipse cx="26" cy="93" rx="3" ry="5" stroke="#facc15" strokeWidth="1.5" fill="none" />

            <path d="M86 38 Q115 42 130 55" stroke="#6b21a8" strokeWidth="4" strokeLinecap="round" />
            <path d="M138 48 C144 65 136 85 124 82 C116 75 118 55 132 50 Z" fill="#7e22ce" stroke="#3b0764" strokeWidth="1.5" />
            <ellipse cx="134" cy="85" rx="3" ry="5" stroke="#facc15" strokeWidth="1.5" fill="none" />
            <ellipse cx="134" cy="93" rx="3" ry="5" stroke="#facc15" strokeWidth="1.5" fill="none" />

            {/* Distorted Skull Head */}
            <ellipse cx="80" cy="24" rx="14" ry="16" fill="#c084fc" stroke="#3b0764" strokeWidth="1.5" />

            {/* Sunken Agonized Glowing Yellow Eyes */}
            <circle cx="75" cy="20" r="3" fill="#18022b" />
            <circle cx="75" cy="20" r="1.5" fill="#facc15" />
            <circle cx="85" cy="20" r="3" fill="#18022b" />
            <circle cx="85" cy="20" r="1.5" fill="#facc15" />

            {/* Pinhole Whistling Mouth emitting ghost souls (ปากเท่ารูเข็มส่งเสียงหวีดแหลม) */}
            <circle cx="80" cy="30" r="2.5" fill="#18022b" stroke="#ef4444" strokeWidth="1" />
            {/* Ectoplasmic soul vapor escaping */}
            <path d="M80 30 Q72 34 68 40 Q74 38 80 42" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            <path d="M80 30 Q88 35 92 41" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
          </svg>
        );

      case 'G07': // ปอบหยิบกระชากเครื่องใน (Gore-Ripping Pop)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="pop-blood-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#991b1b" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#450a0a" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#180505" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#pop-blood-glow)" />

            {/* Blood splatter backdrop */}
            <circle cx="34" cy="40" r="4" fill="#dc2626" opacity="0.8" />
            <circle cx="128" cy="42" r="5" fill="#b91c1c" opacity="0.8" />
            <circle cx="28" cy="120" r="3" fill="#dc2626" />
            <circle cx="134" cy="115" r="4" fill="#991b1b" />

            {/* Demonic Body */}
            <ellipse cx="80" cy="108" rx="28" ry="30" fill="#44403c" stroke="#1c1917" strokeWidth="2" />

            {/* Hands clutching dripping fresh intestine (กำไส้สดๆ) */}
            <path d="M60 115 C55 125 70 135 85 128 C95 122 105 135 95 142 C85 148 70 142 62 135" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
            <circle cx="76" cy="138" r="3" fill="#7f1d1d" />
            <circle cx="90" cy="144" r="2" fill="#7f1d1d" />

            {/* Twisted Claw Hands with 3-inch curved black claws */}
            <path d="M52 105 Q62 112 68 118" stroke="#78716c" strokeWidth="5" strokeLinecap="round" />
            <path d="M68 118 L74 122 M68 115 L76 117" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />

            <path d="M108 105 Q98 112 92 118" stroke="#78716c" strokeWidth="5" strokeLinecap="round" />
            <path d="M92 118 L86 122 M92 115 L84 117" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />

            {/* Crazed Manic Ghoul Head */}
            <circle cx="80" cy="60" r="26" fill="#a8a29e" stroke="#292524" strokeWidth="2" />
            {/* Ragged gray-black hair */}
            <path d="M54 55 Q80 32 106 55 Q100 36 80 36 Q60 36 54 55 Z" fill="#1c1917" />
            <path d="M52 56 L42 68 M108 56 L118 68" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />

            {/* Bulging Bloodshot Eyes with Veins */}
            <ellipse cx="69" cy="56" rx="6" ry="7" fill="#fef2f2" stroke="#7f1d1d" strokeWidth="1.5" />
            <circle cx="69" cy="56" r="3" fill="#dc2626" />
            <circle cx="69" cy="56" r="1" fill="#000000" />
            <path d="M64 54 L67 56 M71 53 L73 55" stroke="#ef4444" strokeWidth="0.8" />

            <ellipse cx="91" cy="56" rx="6" ry="7" fill="#fef2f2" stroke="#7f1d1d" strokeWidth="1.5" />
            <circle cx="91" cy="56" r="3" fill="#dc2626" />
            <circle cx="91" cy="56" r="1" fill="#000000" />
            <path d="M87 53 L89 55 M93 54 L96 56" stroke="#ef4444" strokeWidth="0.8" />

            {/* Gaping Mouth Smeared with Blood & Serrated Teeth */}
            <path d="M66 68 Q80 88 94 68 Z" fill="#260404" stroke="#7f1d1d" strokeWidth="2" />
            <path d="M68 69 L70 75 L73 69 M76 70 L78 76 L81 70 M84 70 L86 76 L89 70 M91 69 L93 75" stroke="#f8fafc" strokeWidth="1.5" />
            {/* Dripping blood from chin */}
            <path d="M78 80 Q80 90 80 94" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            <circle cx="80" cy="96" r="2" fill="#ef4444" />
          </svg>
        );

      case 'G08': // ผีพรายน้ำฉุดลงคลอง (Drowned Water Wraith)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="water-wraith-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0f766e" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#042f2e" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#021715" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#water-wraith-glow)" />

            {/* Murky Water Surface Ripples */}
            <ellipse cx="80" cy="120" rx="60" ry="16" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" opacity="0.8" />
            <ellipse cx="80" cy="132" rx="45" ry="10" fill="#021d1b" stroke="#0d9488" strokeWidth="1.5" opacity="0.6" />

            {/* Decomposing Green Corpse Emerging from Murk */}
            <path d="M60 85 C55 105 60 125 80 125 C100 125 105 105 100 85 Z" fill="#134e4a" stroke="#042f2e" strokeWidth="1.5" />

            {/* Tangled Slimy Seaweed and Rotting Hair */}
            <path d="M48 45 C36 80 40 120 52 135 C58 115 56 80 52 65 Z" fill="#042f2e" />
            <path d="M112 45 C124 80 120 120 108 135 C102 115 104 80 108 65 Z" fill="#042f2e" />
            <path d="M56 46 Q80 32 104 46 Q100 35 80 35 Q60 35 56 46 Z" fill="#021d1b" />

            {/* Decayed Waterlogged Skull with Exposed Patches */}
            <circle cx="80" cy="62" r="26" fill="#5eead4" stroke="#115e59" strokeWidth="2" opacity="0.9" />
            <circle cx="92" cy="54" r="5" fill="#0f766e" opacity="0.6" /> {/* Rot patch */}

            {/* Blank Milky White Dead Eyes */}
            <ellipse cx="70" cy="60" rx="5" ry="6" fill="#042f2e" />
            <circle cx="70" cy="60" r="3.5" fill="#f0fdfa" />
            <circle cx="70" cy="60" r="1.5" fill="#99f6e4" />

            <ellipse cx="90" cy="60" rx="5" ry="6" fill="#042f2e" />
            <circle cx="90" cy="60" r="3.5" fill="#f0fdfa" />
            <circle cx="90" cy="60" r="1.5" fill="#99f6e4" />

            {/* Rotting Agape Mouth with Black Teeth */}
            <path d="M72 74 Q80 86 88 74 Z" fill="#042f2e" stroke="#115e59" strokeWidth="1.5" />
            <polygon points="76,75 78,80 80,75" fill="#0d9488" />
            <polygon points="82,75 84,80 86,75" fill="#0d9488" />

            {/* Waterlogged Claws reaching UP from the black water to drag runner down */}
            <path d="M38 126 Q46 100 52 92" stroke="#5eead4" strokeWidth="5" strokeLinecap="round" />
            <line x1="52" y1="92" x2="55" y2="84" stroke="#042f2e" strokeWidth="2.5" />
            <line x1="50" y1="93" x2="51" y2="85" stroke="#042f2e" strokeWidth="2.5" />

            <path d="M122 126 Q114 100 108 92" stroke="#5eead4" strokeWidth="5" strokeLinecap="round" />
            <line x1="108" y1="92" x2="105" y2="84" stroke="#042f2e" strokeWidth="2.5" />
            <line x1="110" y1="93" x2="109" y2="85" stroke="#042f2e" strokeWidth="2.5" />
          </svg>
        );

      case 'G09': // ผีตาโขนหัวกะโหลกปีศาจ (Skull Demon Phi Ta Khon)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="takon-skull-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#be123c" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#4c0519" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1c0309" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#takon-skull-glow)" />

            {/* Charred Steamer Hat (หวดนึ่งข้าวไหม้เกรียมยอดแหลม) */}
            <path d="M58 55 L70 8 L90 8 L102 55 Z" fill="#1c1917" stroke="#7f1d1d" strokeWidth="2" />
            <path d="M66 40 L94 40 M68 24 L92 24" stroke="#dc2626" strokeWidth="2" />
            {/* Demon horns on hat */}
            <path d="M68 18 Q50 6 42 16 Q58 24 66 22" fill="#991b1b" stroke="#450a0a" strokeWidth="1.5" />
            <path d="M92 18 Q110 6 118 16 Q102 24 94 22" fill="#991b1b" stroke="#450a0a" strokeWidth="1.5" />

            {/* Bloodstained Ritual Ribbons */}
            <path d="M40 65 Q24 95 35 135" stroke="#7f1d1d" strokeWidth="4" strokeLinecap="round" />
            <path d="M46 68 Q34 105 44 142" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
            <path d="M120 65 Q136 95 125 135" stroke="#7f1d1d" strokeWidth="4" strokeLinecap="round" />
            <path d="M114 68 Q126 105 116 142" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />

            {/* Horned Demonic Skull Mask Base */}
            <ellipse cx="80" cy="82" rx="32" ry="34" fill="#f8fafc" stroke="#1c1917" strokeWidth="3" />

            {/* Long Carved Bloodied Nose */}
            <path d="M80 66 Q102 78 96 94 Q80 96 76 86 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="1.5" />

            {/* Fiery Demon Eye Sockets */}
            <polygon points="60,70 72,66 74,78 62,80" fill="#1c1917" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="67" cy="74" r="3" fill="#ef4444" />
            <circle cx="67" cy="74" r="1" fill="#fef08a" />

            <polygon points="100,70 88,66 86,78 98,80" fill="#1c1917" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="93" cy="74" r="3" fill="#ef4444" />
            <circle cx="93" cy="74" r="1" fill="#fef08a" />

            {/* Massive Grinning Skull Teeth with Blood Dripping */}
            <rect x="62" y="98" width="36" height="14" rx="2" fill="#1c1917" stroke="#7f1d1d" strokeWidth="2" />
            {/* Sharp serrated teeth */}
            <path d="M64 99 L67 106 L70 99 M72 99 L75 106 L78 99 M80 99 L83 106 L86 99 M88 99 L91 106 L94 99" stroke="#f8fafc" strokeWidth="2" />
            <path d="M66 111 L69 105 L72 111 M74 111 L77 105 L80 111 M82 111 L85 105 L88 111 M90 111 L93 105" stroke="#f8fafc" strokeWidth="2" />
            {/* Blood drips from jaw */}
            <path d="M72 113 L72 122 M86 113 L86 125" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'G10': // นางรำคอหักเลือดเย็น (Broken-Neck Spirit Dancer)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="dancer-blood-moon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#831843" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#4c0519" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1a040b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#dancer-blood-moon)" />

            {/* Blood Moon in background */}
            <circle cx="80" cy="75" r="54" fill="#991b1b" opacity="0.35" />

            {/* Broken Neck & Snapped Head Angle (คอหักพับ 90 องศา สยองขวัญ) */}
            <g transform="rotate(-32 75 60)">
              {/* Tarnished Dark Chada Crown with Broken Spire */}
              <path d="M68 36 L75 4 L82 36 Z" fill="#ca8a04" stroke="#713f12" strokeWidth="1.5" />
              <path d="M73 4 L77 12 L71 14 Z" fill="#991b1b" /> {/* Blood on tip */}
              <rect x="62" y="34" width="26" height="8" rx="2" fill="#a16207" />

              {/* Pale Cracked Porcelain Face */}
              <circle cx="75" cy="55" r="23" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />

              {/* Facial Cracks */}
              <path d="M62 48 L68 54 L66 60 M85 46 L82 52 L86 58" stroke="#334155" strokeWidth="1" />

              {/* Blackened Hollow Eye Sockets with Crimson Blood Tears */}
              <ellipse cx="67" cy="52" rx="4.5" ry="6" fill="#020617" />
              <circle cx="67" cy="52" r="1.5" fill="#ef4444" />
              <path d="M67 58 L66 70" stroke="#7f1d1d" strokeWidth="2" />

              <ellipse cx="83" cy="52" rx="4.5" ry="6" fill="#020617" />
              <circle cx="83" cy="52" r="1.5" fill="#ef4444" />
              <path d="M83 58 L84 70" stroke="#7f1d1d" strokeWidth="2" />

              {/* Twisted Smile with Stitched Lips */}
              <path d="M70 66 Q75 72 80 66" stroke="#450a0a" strokeWidth="2" fill="none" />
              <line x1="72" y1="65" x2="72" y2="69" stroke="#000" strokeWidth="1" />
              <line x1="75" y1="66" x2="75" y2="70" stroke="#000" strokeWidth="1" />
              <line x1="78" y1="65" x2="78" y2="69" stroke="#000" strokeWidth="1" />
            </g>

            {/* Exposed Broken Cervical Vertebrae (กระดูกคอหักลั่น) */}
            <path d="M74 72 L78 78 L72 84" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
            <circle cx="74" cy="78" r="4" fill="#7f1d1d" />

            {/* Traditional Bloodstained Silk Sbai */}
            <path d="M58 85 L98 85 L94 145 L62 145 Z" fill="#701a75" />
            <path d="M56 86 Q76 94 96 86 L92 110 Q76 116 56 108 Z" fill="#4a044e" />

            {/* Contorted Backward Dancing Fingers with 4-inch Brass Talons (เล็บรำคมกริบ) */}
            <path d="M102 85 Q125 70 132 60" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
            {/* Razor sharp brass finger nails */}
            <path d="M132 60 Q145 45 138 38" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
            <circle cx="138" cy="38" r="1.5" fill="#ef4444" />
          </svg>
        );

      case 'G11': // ผีโพงเขมือบซากศพ (Corpse-Feasting Phi Phong)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="phong-toxic-beam" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#4d7c0f" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="#14532d" fillOpacity="0.25" />

            {/* Massive Piercing Toxic Green Beam Blasting From Nose (ลำแสงไฟผีพุ่งจากจมูก) */}
            <path d="M80 72 L18 152 L142 152 Z" fill="url(#phong-toxic-beam)" opacity="0.6" />

            {/* Feral Ghoul Body in Shadows */}
            <ellipse cx="80" cy="115" rx="30" ry="28" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />

            {/* Dead Bloody Carcass being torn apart in hands */}
            <ellipse cx="80" cy="132" rx="16" ry="10" fill="#450a0a" stroke="#7f1d1d" strokeWidth="1.5" />
            <path d="M72 130 L66 125 M88 130 L94 125" stroke="#ef4444" strokeWidth="2" />

            {/* Demonic Feral Head */}
            <circle cx="80" cy="62" r="26" fill="#475569" stroke="#1e293b" strokeWidth="2" />
            {/* Ragged tangled hair with decaying leaves */}
            <path d="M54 55 Q80 34 106 55 Q98 34 80 34 Q62 34 54 55 Z" fill="#0f172a" />
            <path d="M48 58 L38 72 M112 58 L122 72" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />

            {/* Feral Yellow-Green Predatory Eyes */}
            <ellipse cx="68" cy="58" rx="6" ry="6" fill="#052e16" />
            <circle cx="68" cy="58" r="3" fill="#a3e635" />
            <circle cx="68" cy="58" r="1" fill="#ffffff" />

            <ellipse cx="92" cy="58" rx="6" ry="6" fill="#052e16" />
            <circle cx="92" cy="58" r="3" fill="#a3e635" />
            <circle cx="92" cy="58" r="1" fill="#ffffff" />

            {/* THE TERRIFYING GLOWING NOSE (จมูกเรืองแสงไฟผีพุ่งพล่าน) */}
            <circle cx="80" cy="68" r="9" fill="#bef264" filter="drop-shadow(0 0 12px #84cc16)" />
            <circle cx="80" cy="68" r="5" fill="#ffffff" />

            {/* Gaping predatory mouth with blood and entrails */}
            <path d="M70 78 Q80 92 90 78 Z" fill="#260404" stroke="#7f1d1d" strokeWidth="2" />
            <polygon points="73,79 76,85 79,79" fill="#f8fafc" />
            <polygon points="81,79 84,85 87,79" fill="#f8fafc" />
            <path d="M80 86 L80 95" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'G12': // กุมารผีพรายสะกดรอย (Cursed Child Kuman Phrai)
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <defs>
              <radialGradient id="kuman-blood-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#991b1b" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#450a0a" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1c1917" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="76" fill="url(#kuman-blood-glow)" />

            {/* Cursed Ritual Circle Ring */}
            <circle cx="80" cy="78" r="64" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.8" />

            {/* Sitting atop an aged cracked human skull */}
            <ellipse cx="80" cy="132" rx="22" ry="16" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <circle cx="73" cy="130" r="4" fill="#0f172a" />
            <circle cx="87" cy="130" r="4" fill="#0f172a" />
            <path d="M76 142 L84 142" stroke="#0f172a" strokeWidth="2" />

            {/* Corpse-Blue Child Body */}
            <circle cx="80" cy="98" rx="18" ry="20" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="1.5" />
            {/* Blood red waist cord with bone amulets */}
            <path d="M68 105 Q80 114 92 105" stroke="#991b1b" strokeWidth="3" />
            <circle cx="80" cy="112" r="3" fill="#f8fafc" />

            {/* Corpse-Blue Infant Head */}
            <circle cx="80" cy="58" r="26" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1.5" />

            {/* Stitched Incision Marks Around Neck (รอยเย็บรอบคอ) */}
            <path d="M62 78 Q80 86 98 78" stroke="#7f1d1d" strokeWidth="2" />
            <line x1="68" y1="76" x2="68" y2="82" stroke="#1c1917" strokeWidth="1.5" />
            <line x1="74" y1="78" x2="74" y2="84" stroke="#1c1917" strokeWidth="1.5" />
            <line x1="80" y1="79" x2="80" y2="85" stroke="#1c1917" strokeWidth="1.5" />
            <line x1="86" y1="78" x2="86" y2="84" stroke="#1c1917" strokeWidth="1.5" />
            <line x1="92" y1="76" x2="92" y2="82" stroke="#1c1917" strokeWidth="1.5" />

            {/* Single Black Topknot with Red Ribbon */}
            <ellipse cx="80" cy="30" rx="8" ry="12" fill="#020617" />
            <circle cx="80" cy="38" r="4" fill="#dc2626" />

            {/* Pitch-Black Void Eyes with Burning Scarlet Pinpoints */}
            <circle cx="69" cy="56" r="6" fill="#020617" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="69" cy="56" r="2" fill="#ef4444" />
            <circle cx="69" cy="56" r="0.8" fill="#ffffff" />

            <circle cx="91" cy="56" r="6" fill="#020617" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="91" cy="56" r="2" fill="#ef4444" />
            <circle cx="91" cy="56" r="0.8" fill="#ffffff" />

            {/* Sinister Grinning Mouth with Needle Teeth */}
            <path d="M70 68 Q80 78 90 68 Z" fill="#450a0a" stroke="#000" strokeWidth="1.5" />
            <path d="M72 68 L74 73 L76 68 M78 69 L80 74 L82 69 M84 69 L86 74 L88 68" stroke="#f8fafc" strokeWidth="1.5" />

            {/* Holding dark sacrificial blood cup */}
            <ellipse cx="112" cy="98" rx="8" ry="10" fill="#450a0a" stroke="#1c1917" strokeWidth="1.5" />
            <ellipse cx="112" cy="94" rx="7" ry="3" fill="#dc2626" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
            <circle cx="80" cy="80" r="70" fill="#dc2626" fillOpacity="0.3" />
            <circle cx="80" cy="70" r="30" fill="#cbd5e1" />
            <circle cx="70" cy="65" r="5" fill="#020617" />
            <circle cx="70" cy="65" r="2" fill="#ef4444" />
            <circle cx="90" cy="65" r="5" fill="#020617" />
            <circle cx="90" cy="65" r="2" fill="#ef4444" />
            <path d="M72 78 Q80 88 88 78 Z" fill="#450a0a" />
          </svg>
        );
    }
  }

  // Cute Mode (Original Friendly/Party Vector Illustrations)
  switch (code) {
    case 'G01': // กระสือน้อยสายปาร์ตี้ (Cute Party Krasue)
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <defs>
            <radialGradient id="krasue-glow-cute" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#ff758f" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hair-grad-cute" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2b1055" />
              <stop offset="100%" stopColor="#4a154b" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r="75" fill="url(#krasue-glow-cute)" />
          <circle cx="30" cy="40" r="4" fill="#ffdf00" />
          <circle cx="130" cy="35" r="3" fill="#00ff9d" />
          <path d="M70 115 C70 105 80 100 80 110 C80 100 90 105 90 115 C90 128 80 135 80 135 C80 135 70 128 70 115 Z" fill="#ff4d6d" opacity="0.9" />
          <circle cx="65" cy="125" r="6" fill="#ff85a1" opacity="0.8" />
          <circle cx="95" cy="125" r="6" fill="#ff85a1" opacity="0.8" />
          <circle cx="80" cy="140" r="4" fill="#00ff9d" opacity="0.9" />
          <path d="M40 70 C35 30 125 30 120 70 C120 100 110 105 80 105 C50 105 40 100 40 70 Z" fill="url(#hair-grad-cute)" />
          <ellipse cx="80" cy="72" rx="32" ry="30" fill="#fff5eb" />
          <circle cx="108" cy="50" r="8" fill="#ff6b00" />
          <circle cx="108" cy="50" r="4" fill="#ffe600" />
          <circle cx="60" cy="78" r="6" fill="#ff99a8" opacity="0.7" />
          <circle cx="100" cy="78" r="6" fill="#ff99a8" opacity="0.7" />
          <circle cx="68" cy="68" r="5" fill="#1e1035" />
          <circle cx="70" cy="66" r="2" fill="#ffffff" />
          <circle cx="92" cy="68" r="5" fill="#1e1035" />
          <circle cx="94" cy="66" r="2" fill="#ffffff" />
          <path d="M74 80 Q80 87 86 80" stroke="#1e1035" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'G02': // กระหังจอมพลัง (Krahang with winnowing baskets)
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#38bdf8" fillOpacity="0.2" />
          <ellipse cx="28" cy="75" rx="24" ry="34" transform="rotate(-15 28 75)" fill="#d97706" stroke="#b45309" strokeWidth="3" />
          <ellipse cx="132" cy="75" rx="24" ry="34" transform="rotate(15 132 75)" fill="#d97706" stroke="#b45309" strokeWidth="3" />
          <ellipse cx="80" cy="110" rx="22" ry="24" fill="#fcd34d" />
          <path d="M64 112 Q80 132 96 112 L92 135 L68 135 Z" fill="#b91c1c" />
          <circle cx="80" cy="62" r="26" fill="#fed7aa" />
          <path d="M56 56 Q80 40 104 56 Q100 42 80 42 Q60 42 56 56 Z" fill="#1e293b" />
          <circle cx="80" cy="36" r="10" fill="#1e293b" />
          <circle cx="68" cy="65" r="4.5" fill="#0f172a" />
          <circle cx="70" cy="63" r="1.5" fill="#fff" />
          <circle cx="92" cy="65" r="4.5" fill="#0f172a" />
          <circle cx="94" cy="63" r="1.5" fill="#fff" />
          <path d="M72 75 Q80 82 88 75" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'G03': // นางตานีสายละมุน (Nang Tani Banana Maiden)
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#10b981" fillOpacity="0.2" />
          <path d="M48 60 C40 100 45 140 55 145 C65 110 65 90 60 70 Z" fill="#0f172a" />
          <path d="M112 60 C120 100 115 140 105 145 C95 110 95 90 100 70 Z" fill="#0f172a" />
          <path d="M62 90 L98 126 L90 148 L58 140 Z" fill="#10b981" />
          <circle cx="80" cy="62" r="26" fill="#fff5eb" />
          <circle cx="106" cy="52" r="8" fill="#fef08a" />
          <circle cx="65" cy="70" r="5" fill="#f472b6" opacity="0.6" />
          <circle cx="95" cy="70" r="5" fill="#f472b6" opacity="0.6" />
          <ellipse cx="70" cy="62" rx="4" ry="5" fill="#1e293b" />
          <circle cx="71" cy="60" r="1.5" fill="#fff" />
          <ellipse cx="90" cy="62" rx="4" ry="5" fill="#1e293b" />
          <circle cx="91" cy="60" r="1.5" fill="#fff" />
          <path d="M74 74 Q80 80 86 74" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'G04': // ผีกองกอยสายลุย (Phi Kong Koi)
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#f59e0b" fillOpacity="0.2" />
          <ellipse cx="80" cy="144" rx="20" ry="10" fill="#ef4444" />
          <circle cx="80" cy="95" r="25" fill="#fbbf24" />
          <circle cx="80" cy="68" r="25" fill="#fed7aa" />
          <circle cx="70" cy="66" r="6" fill="#0f172a" />
          <circle cx="72" cy="64" r="2.5" fill="#ffffff" />
          <circle cx="90" cy="66" r="6" fill="#0f172a" />
          <circle cx="92" cy="64" r="2.5" fill="#ffffff" />
          <path d="M74 76 Q80 88 86 76 Z" fill="#b91c1c" />
        </svg>
      );

    case 'G05': // แม่นากสายรัก
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#ec4899" fillOpacity="0.2" />
          <path d="M92 90 Q125 70 135 55" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
          <circle cx="80" cy="62" r="26" fill="#fff5eb" />
          <ellipse cx="71" cy="63" rx="4.5" ry="5.5" fill="#1e1b4b" />
          <circle cx="72.5" cy="61" r="2" fill="#fff" />
          <ellipse cx="89" cy="63" rx="4.5" ry="5.5" fill="#1e1b4b" />
          <circle cx="90.5" cy="61" r="2" fill="#fff" />
          <path d="M75 75 Q80 81 85 75" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'G06': // เปรตขายาว
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#a855f7" fillOpacity="0.2" />
          <path d="M72 80 L62 115 L40 142" stroke="#c084fc" strokeWidth="7" strokeLinecap="round" />
          <path d="M88 80 L102 112 L125 136" stroke="#c084fc" strokeWidth="7" strokeLinecap="round" />
          <rect x="73" y="45" width="14" height="42" rx="7" fill="#c084fc" />
          <ellipse cx="80" cy="38" rx="16" ry="18" fill="#e9d5ff" />
          <circle cx="74" cy="36" r="3.5" fill="#3b0764" />
          <circle cx="86" cy="36" r="3.5" fill="#3b0764" />
          <circle cx="80" cy="46" r="3" fill="#a855f7" />
        </svg>
      );

    case 'G07': // ปอบสายกิน
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#f97316" fillOpacity="0.2" />
          <circle cx="80" cy="108" r="32" fill="#fed7aa" />
          <circle cx="80" cy="62" r="26" fill="#fed7aa" />
          <circle cx="70" cy="63" r="5" fill="#431407" />
          <circle cx="90" cy="63" r="5" fill="#431407" />
          <path d="M72 74 Q80 88 88 74 Z" fill="#991b1b" />
        </svg>
      );

    case 'G08': // ผีบ้านผีเรือน
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#14b8a6" fillOpacity="0.2" />
          <path d="M50 48 L80 24 L110 48 L104 54 L80 35 L56 54 Z" fill="#f59e0b" />
          <circle cx="80" cy="68" r="24" fill="#fffbeb" />
          <path d="M74 76 Q80 82 86 76" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'G09': // ผีตาโขน
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#f43f5e" fillOpacity="0.2" />
          <path d="M60 55 L70 12 L90 12 L100 55 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
          <ellipse cx="80" cy="80" rx="30" ry="32" fill="#ffffff" stroke="#e11d48" strokeWidth="3" />
          <circle cx="66" cy="74" r="5" fill="#1e1b4b" />
          <circle cx="94" cy="74" r="5" fill="#1e1b4b" />
          <rect x="66" y="96" width="28" height="10" rx="4" fill="#ffffff" stroke="#991b1b" strokeWidth="2" />
        </svg>
      );

    case 'G10': // นางรำ
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#e879f9" fillOpacity="0.2" />
          <path d="M72 45 L80 10 L88 45 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="80" cy="64" r="24" fill="#fff5eb" />
          <ellipse cx="71" cy="64" rx="4" ry="4.5" fill="#1e1b4b" />
          <ellipse cx="89" cy="64" rx="4" ry="4.5" fill="#1e1b4b" />
          <path d="M75 75 Q80 79 85 75" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'G11': // ผีโพง
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#84cc16" fillOpacity="0.2" />
          <circle cx="80" cy="65" r="26" fill="#fed7aa" />
          <circle cx="80" cy="74" r="8" fill="#bef264" filter="drop-shadow(0 0 10px #a3e635)" />
          <circle cx="68" cy="64" r="5" fill="#14532d" />
          <circle cx="92" cy="64" r="5" fill="#14532d" />
          <path d="M72 85 Q80 92 88 85" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'G12': // กุมารทอง
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="75" fill="#eab308" fillOpacity="0.22" />
          <circle cx="80" cy="65" r="26" fill="#fef08a" />
          <circle cx="70" cy="64" r="5" fill="#451a03" />
          <circle cx="90" cy="64" r="5" fill="#451a03" />
          <path d="M72 75 Q80 85 88 75 Z" fill="#991b1b" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} className={className} fill="none">
          <circle cx="80" cy="80" r="70" fill="#ff6b00" fillOpacity="0.2" />
          <circle cx="80" cy="70" r="30" fill="#fed7aa" />
          <circle cx="70" cy="65" r="4" fill="#1e1b4b" />
          <circle cx="90" cy="65" r="4" fill="#1e1b4b" />
          <path d="M74 76 Q80 82 86 76" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
