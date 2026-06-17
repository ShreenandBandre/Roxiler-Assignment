
import React from 'react';
const StoreCard = ({ store, onRate }) => {
  return (
    <div className="premium-card p-6 flex flex-col justify-between space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-base font-medium text-white tracking-tight line-clamp-2">{store.name}</h3>
          <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#0d0f17] border border-[#222634] rounded-md text-gray-200 whitespace-nowrap shadow-sm">
            ★ {store.overallRating > 0 ? Number(store.overallRating).toFixed(1) : '0.0'}
          </span>
        </div>
        <div className="space-y-1 pt-1">
          <p className="text-gray-500 font-mono text-[11px] tracking-tight">Contact: {store.email || 'N/A'}</p>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">Location: {store.address || 'Address not listed'}</p>
        </div>
      </div>

      {/* Rating Upsert Engine Box */}
      <div className="border-t border-[#222634] pt-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
            {store.myRating ? 'Modify Vote Status' : 'Cast Star Value'}
          </span>
          
          {/* Interactive Clean 5 Star Widget */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isHighlighted = star <= (store.myRating || 0);
              return (
                <button
                  key={star}
                  onClick={() => onRate(store.id, star)}
                  className="focus:outline-none cursor-pointer transition-transform duration-150 active:scale-95 text-lg"
                  title={`Rate ${star} Stars`}
                >
                  <span className={isHighlighted ? 'text-amber-400' : 'text-gray-700 hover:text-gray-400'}>★</span>
                </button>
              );
            })}
          </div>
        </div>
        {store.myRating && (
          <div className="text-right">
            <span className="text-[10px] font-mono font-medium text-gray-400 bg-[#0d0f17] border border-[#222634]/60 px-2 py-0.5 rounded">
              Your Score: {store.myRating} ★
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCard;