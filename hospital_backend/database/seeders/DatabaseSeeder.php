<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Patient;
use App\Models\Doctor;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create a few users with different roles
        $users = [
            [
                'name' => 'Admin123',
                'email' => 'admin123@gmail.com',
                'password' => Hash::make('1234'),
                'role' => 'admin',
                'udpated' => 'admin',
            ],
            [
                'name' => 'Doctor Juan',
                'email' => 'doctor123@gmail.com',
                'password' => Hash::make('1234'),
                'role' => 'doctor',
            ],
            [
                'name' => 'Patient MAy',
                'email' => 'patient123@gmail.com',
                'password' => Hash::make('1234'),
                'role' => 'patient',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => $userData['password'],
                'role' => $userData['role'],
            ]);

            // Depending on the role, associate with patient or doctor
            if ($user->role === 'doctor') {
                $this->createDoctorForUser($user);
            } elseif ($user->role === 'patient') {
                $this->createPatientForUser($user);
            }
        }
    }

    
}
