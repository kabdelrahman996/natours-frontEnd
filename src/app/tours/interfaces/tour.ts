import { User } from '../../auth/interfaces/user';

// Guide for populating tours with user info
// export interface Guide {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
//   photo: string;
// }

export interface Location {
  type: string;
  coordinates: [number, number];
  address?: string;
  description?: string;
  day?: number;
  _id?: string;
}

export interface StartLocation {
  type: string;
  coordinates: [number, number];
  description?: string;
  address?: string;
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    photo: string;
  };
}

export interface Tour {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  createdAt?: string;
  startDates: string[];
  secretTour?: boolean;
  startLocation: StartLocation;
  locations: Location[];
  guides: User[];
  durationWeeks?: number;
  reviews?: Review[];
}
