import React from 'react';
import { BgType } from '../types/game';

interface BackgroundViewProps {
  bgType: BgType;
}

export const BackgroundView: React.FC<BackgroundViewProps> = ({ bgType }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-1000 select-none">
      {/* Dynamic Backgrounds based on Scene */}
      {bgType === 'gyeonghoeru_night' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#090b14] via-[#101728] to-[#0a101d]">
          {/* Glowing Full Moon */}
          <div className="absolute top-10 right-20 w-36 h-36 rounded-full bg-[#fffae0] shadow-[0_0_80px_rgba(255,245,190,0.6)] opacity-95">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ede4b8] to-transparent opacity-40"></div>
          </div>
          {/* Moonlit Clouds */}
          <div className="absolute top-16 right-8 w-72 h-14 bg-gradient-to-r from-transparent via-[#2b354f]/50 to-transparent blur-md"></div>
          
          {/* Distant Mountains */}
          <div className="absolute bottom-36 left-0 right-0 h-48 opacity-40">
            <svg viewBox="0 0 1200 300" className="w-full h-full object-cover">
              <path d="M0,220 Q200,120 400,200 T800,140 Q1000,100 1200,230 L1200,300 L0,300 Z" fill="#080d1a" />
              <path d="M0,250 Q300,160 600,240 T1200,190 L1200,300 L0,300 Z" fill="#050811" />
            </svg>
          </div>

          {/* Gyeonghoeru Pavilion Silhouette & Lake Reflection */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#05070e] via-[#091122] to-transparent">
            {/* Traditional Hanok Roof Silhouettes */}
            <div className="absolute bottom-20 left-12 w-96 h-40 opacity-80">
              <div className="w-full h-4 bg-[#141a29] rounded-t-lg shadow-lg transform -skew-x-6 border-b border-[#2b3852]"></div>
              <div className="w-5/6 mx-auto h-2 bg-[#1b2234]"></div>
              <div className="w-full h-24 bg-[#0e1320]/90 border-t-2 border-[#334261] flex justify-around items-center px-4">
                <div className="w-3 h-20 bg-[#1e2638] rounded"></div>
                <div className="w-3 h-20 bg-[#1e2638] rounded"></div>
                <div className="w-8 h-12 bg-[#e67e22]/20 rounded-sm animate-lantern flex items-center justify-center">
                  <div className="w-2 h-4 bg-[#f39c12] rounded-full blur-[1px]"></div>
                </div>
                <div className="w-3 h-20 bg-[#1e2638] rounded"></div>
                <div className="w-3 h-20 bg-[#1e2638] rounded"></div>
              </div>
            </div>

            {/* Pine Trees Silhouette */}
            <div className="absolute bottom-16 right-16 w-80 h-60 opacity-60 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path d="M100,20 Q80,80 50,180 L150,180 Q120,80 100,20 Z" fill="#04060b" />
                <circle cx="90" cy="50" r="35" fill="#060912" />
                <circle cx="120" cy="70" r="30" fill="#050810" />
                <circle cx="60" cy="90" r="40" fill="#04070d" />
              </svg>
            </div>

            {/* Lotus Pond Water Ripples */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#030408] to-[#080e1d]/80 border-t border-[#1a253d]/50">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1d2d4c]/30 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      )}

      {bgType === 'donggung_room' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#18110c] via-[#241710] to-[#120d09]">
          {/* Traditional Hanji Sliding Door Panels (창호지 문) */}
          <div className="absolute inset-x-8 top-10 bottom-24 flex justify-between gap-6 opacity-30 pointer-events-none">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex-1 border-2 border-[#5c4033] bg-[#f7f3e8]/10 grid grid-cols-4 grid-rows-8 gap-1 p-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="border border-[#4a3328]/40 bg-[#eedcbe]/5"></div>
                ))}
              </div>
            ))}
          </div>

          {/* Candlelight Glow & Room Atmosphere */}
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[#f39c12]/15 blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-[#e67e22]/10 blur-3xl"></div>

          {/* Traditional Wooden Furniture Silhouette */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-[#0d0906] border-t-4 border-[#3e2723] flex justify-between items-end px-16">
            {/* Low Desk (서안) */}
            <div className="w-72 h-20 bg-[#2d1b10] border-t-2 border-[#6d4c41] rounded-t-sm shadow-2xl relative">
              <div className="absolute -top-6 left-12 w-6 h-6 rounded-full bg-[#e2dec9]/80 border border-[#8d6e63]"></div>
              <div className="absolute -top-4 right-16 w-12 h-4 bg-[#8d6e63] rounded-sm"></div>
            </div>
            {/* Traditional Cabinet (반닫이 궤짝) */}
            <div className="w-64 h-32 bg-[#1c120c] border-2 border-[#4e342e] rounded-t flex flex-col justify-around p-2">
              <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#d4af37]/60 flex items-center justify-center">
                <div className="w-4 h-6 bg-[#d4af37]/40 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {bgType === 'naeuwon' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#0f1715] via-[#142320] to-[#0a100f]">
          {/* Medicine Drawers Wall (약장벽) */}
          <div className="absolute inset-x-12 top-12 bottom-28 grid grid-cols-8 grid-rows-6 gap-2 opacity-25">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-[#2d6a4f]/50 bg-[#1b4332]/20 rounded-sm flex items-center justify-center text-[10px] text-[#74c69d]">
                藥
              </div>
            ))}
          </div>

          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#52b788]/10 blur-3xl"></div>
          
          {/* Herbal Dispensary Table */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#08100e] border-t-4 border-[#1b4332] flex justify-around items-end px-20">
            <div className="w-80 h-24 bg-[#10201c] border-t-2 border-[#2d6a4f] rounded-t p-3 relative">
              <div className="text-xs text-[#52b788]/60 font-traditional">內醫院 藥材處方</div>
            </div>
          </div>
        </div>
      )}

      {bgType === 'palace_gate' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#07090e] via-[#0d131f] to-[#080a10]">
          {/* Moonlit Castle Wall (성곽과 자하문) */}
          <div className="absolute top-8 left-16 w-32 h-32 rounded-full bg-[#fffce0] shadow-[0_0_60px_rgba(255,245,180,0.5)]"></div>
          
          <div className="absolute bottom-24 left-0 right-0 h-56 bg-[#111726] border-t-4 border-[#25324d] flex items-end">
            {/* Fortress Stone Pattern */}
            <div className="w-full h-full grid grid-cols-12 grid-rows-4 gap-1 p-2 opacity-30">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-[#3d4f73] bg-[#1a2336]/40"></div>
              ))}
            </div>
            {/* Massive Iron Grate Gate */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-64 h-48 bg-[#0a0d14] border-x-4 border-t-4 border-[#334155] rounded-t-full flex justify-around p-2">
              <div className="w-2 h-full bg-[#1e293b]"></div>
              <div className="w-2 h-full bg-[#1e293b]"></div>
              <div className="w-2 h-full bg-[#1e293b]"></div>
              <div className="w-2 h-full bg-[#1e293b]"></div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#05070a] border-t-2 border-[#1e293b]"></div>
        </div>
      )}

      {bgType === 'shrine_night' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#180507] via-[#240a0e] to-[#0f0305]">
          {/* Ominous Red Moon & Eerie Mist */}
          <div className="absolute top-8 right-24 w-32 h-32 rounded-full bg-[#ff4d4d]/80 shadow-[0_0_80px_rgba(255,50,50,0.6)]"></div>
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#d00000]/15 blur-3xl"></div>

          {/* Creepy Shrine Pillars and Ropes */}
          <div className="absolute inset-x-16 top-16 bottom-24 flex justify-between pointer-events-none opacity-40">
            <div className="w-8 h-full bg-[#370617] border-x border-[#6a040f]"></div>
            <div className="w-8 h-full bg-[#370617] border-x border-[#6a040f]"></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-44 bg-[#0a0203] border-t-4 border-[#6a040f] flex justify-center items-end">
            {/* Shaman Altar */}
            <div className="w-96 h-28 bg-[#1f0509] border-t-2 border-[#9d0208] rounded-t relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-[#ffba08]/50 bg-[#370617] flex items-center justify-center text-xs text-[#ffba08]">
                神鏡
              </div>
            </div>
          </div>
        </div>
      )}

      {bgType === 'secret_pavilion' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#0a0f1d] via-[#131c33] to-[#0a0e1a]">
          <div className="absolute top-12 left-24 w-28 h-28 rounded-full bg-[#fff4cc] shadow-[0_0_70px_rgba(255,230,150,0.5)]"></div>
          <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-[#4cc9f0]/10 blur-3xl"></div>

          {/* Pavilion Balcony Railing */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-[#090d18] border-t-4 border-[#2b3a58] flex justify-around items-end px-8">
            <div className="w-full h-24 border-t-2 border-[#3d5178] flex justify-between items-center px-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-3 h-20 bg-[#1c273e] rounded-sm"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {bgType === 'hanyang_street' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#0f1118] via-[#1a1c26] to-[#0d0e14]">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#4a4e69]/20 blur-3xl"></div>
          {/* Thatched Roofs & City Silhouette */}
          <div className="absolute bottom-16 left-0 right-0 h-48 bg-gradient-to-t from-[#090a0f] to-transparent flex justify-around items-end opacity-70">
            <div className="w-64 h-24 bg-[#1f202b] rounded-t-3xl border-t border-[#3f4156]"></div>
            <div className="w-72 h-32 bg-[#161720] rounded-t-3xl border-t border-[#3f4156]"></div>
            <div className="w-64 h-28 bg-[#1f202b] rounded-t-3xl border-t border-[#3f4156]"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#06070a] border-t border-[#262837]"></div>
        </div>
      )}

      {bgType === 'palace_hall' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#1a0f0a] via-[#2a170d] to-[#120a06]">
          {/* Grand Palace Throne Room Pillars */}
          <div className="absolute inset-0 flex justify-between px-16 pointer-events-none opacity-40">
            <div className="w-16 h-full bg-[#540b0e] border-x-2 border-[#9e2a2b]"></div>
            <div className="w-16 h-full bg-[#540b0e] border-x-2 border-[#9e2a2b]"></div>
          </div>
          {/* Throne Podium */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-[#1e0e07] border-t-4 border-[#c5a059] rounded-t-lg flex flex-col items-center justify-center shadow-2xl">
            <div className="text-xl font-traditional text-[#d4af37] tracking-widest opacity-60">
              大殿 · 東宮
            </div>
          </div>
        </div>
      )}

      {bgType === 'ending_moon' && (
        <div className="relative w-full h-full bg-gradient-to-b from-[#0a0e1c] via-[#192442] to-[#0c1224]">
          {/* Giant Radiant Full Moon */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#fffce8] shadow-[0_0_120px_rgba(255,245,190,0.8)] flex items-center justify-center">
            <div className="w-60 h-60 rounded-full bg-gradient-to-tr from-[#ede4ba] to-transparent opacity-60"></div>
          </div>
          {/* Gentle Waves / Flower Field Silhouette */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#060912] via-[#0d1428] to-transparent"></div>
        </div>
      )}

      {/* Subtle Hanji Grain & Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.75)_100%)] pointer-events-none"></div>
    </div>
  );
};
