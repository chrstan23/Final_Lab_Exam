<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Medical_Record;
use App\Models\Appointment;
use Faker\Factory as Faker;

class RecordSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        $doctor = Doctor::findOrFail(1);
        $patient = Patient::findOrFail(1);

        // Create 10 medical records associated with the doctor and patient
        for ($i = 1; $i <= 10; $i++) {
            Medical_Record::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'visit_date' => now()->subDays(rand(1, 30)), // Random visit date within the last 30 days
                'diagnosis' => $faker->sentence,
                'treatment' => $faker->sentence,
                'notes' => 'Notes ' . $i,
            ]);
        }

        // Create 10 appointments associated with the doctor and patient
        for ($i = 1; $i <= 10; $i++) {
            Appointment::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'appointment_date' => now()->addDays(rand(1, 30))->setHour(rand(8, 17))->setMinute(0), // Random appointment date within the next 30 days, setHour is used to randomize the hour of the day
                'status' => 'scheduled',
                'reason' => 'Reason for Appointment ' . $i,
            ]);
        }
    }
}
