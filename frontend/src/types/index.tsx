export interface User {
    id: number ; 
    firstName: string ;
    lastName: string ;
    email: string ;
    role: 'owner' | 'sitter' ;
    city: string; 
    isVerified: boolean;
}

export interface Animal {
    id: number;
    name: string;
    species: 'dog' | 'cat' | 'other';
    breed?: string;
    age: number;
    description?: string;
    ownerId: number;
}

export interface SitterProfile {
    id : number ;
    bio?:string;
    hourlyRate: number;
    acceptedAnimalTypes?: string[];
    city?: string;
    isAvailable: boolean;
    userId: number;
    user?: User;
}

export type BookingWithRelations = Booking & {
  animal?: { id: number; name: string; species: string };
  sitter?: { firstName: string; lastName: string };
  owner?: { firstName: string; lastName: string };
};

export interface Booking {
    id: number;
    ownerId: number ; 
    animalId : number ; 
    sitterId : number ; 
    startDate: string;
    endDate: string;
    status : 'pending' | 'confirmed' | 'cancelled' | 'completed';
    totalPrice: number;
    message?: string;
}

export interface Review {
  id: number;
  bookingId: number;
  rating: number;
  comment?: string;
  ownerId: number;
  sitterId: number;
  owner?: { firstName: string; lastName: string };
}