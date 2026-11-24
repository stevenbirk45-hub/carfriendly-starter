// £1/day advert, max 60 days. Commission only on escrow sales.
export const advertFee=(days:number)=>Math.min(days,60)*1;
export const slotFeeFor=(type:string)=>type==='call'?10:30;
export const commissionFor=(daysOnSale:number,price:number)=>{ if(daysOnSale<=7) return Math.min(price*0.01,199); if(daysOnSale<=21) return Math.min(price*0.012,299); return Math.min(price*0.014,399); };
