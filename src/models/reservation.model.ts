import { Schema, model, Types } from 'mongoose';

export interface IReservation {
  date: Date;
  hours: string;
  text?: string;
  userId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

const reservationSchema = new Schema<IReservation> ({
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  hours: {
    type: String,
    required: [true, "Hours is a required field"],
    match: [/^\d{2}:(00|30)$/, "Hours field must be in HH:MM format, either full hour or half an hour added (e.g. 16:00 or 16:30)"],
  },
  text: {
    type: String,
    maxlength: [200, "Text must be maximum 200 characters"]
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User',   // foreign key logic
    required: true,
  },
  },
  {
    collection: 'reservations',
    timestamps: true,
  },
);

export default model<IReservation>('Reservation', reservationSchema);