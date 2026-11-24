export type VehicleType='car'|'van'|'motorcycle'|'caravan'|'truck';
export type Listing={id:string;title:string;price:number;mileage:number;year:number;postcode:string;photos:string[];video?:string;offerMin:number;slotFeeViewing:number;slotFeeCall:number};
export type Slot={id:string;listingId:string;type:'call'|'viewing';day:string;time:string;fee:number;status:'free'|'booked'|'sold'};
export type Booking={id:string;slotId:string;buyerId:string;fee:number;status:'booked'|'turned-up-bought'|'turned-up-no-buy-refunded'|'sold-before-refunded'|'seller-cancelled-refunded'|'no-show-kept'};
