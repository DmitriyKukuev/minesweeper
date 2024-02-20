<?php

namespace App\Services;

use App\Data\Result;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserService
{
    public function isAuth(): bool
    {
        return Auth::check();
    }

    public function current(bool $force = false): ?User
    {
        static $user;

        if ($force || $user === null) {
            $user = Auth::user();
        }

        return $user;
    }

    /**
     * Авторизация по логину пользователя и паролю.
     * Если пользователь авторизован, сразу возвращает его результат
     * @param string $login
     * @param string $password
     * @param bool $remember
     * @return Result
     */
    public function login(string $login, string $password, bool $remember = false): Result
    {
        $result = new Result();

        if ($this->isAuth()) {
            $result->set('user', $this->current());
            return $result;
        }

        $authSuccess = Auth::attempt([
            'login'    => $login,
            'password' => $password,
        ], $remember);

        if (!$authSuccess) {
            $result->addError('Неверный пароль', 'password');
            return $result;
        }

        request()->session()->regenerate();
        $result->set('user', $this->current());
        return $result;
    }

    public function logout(): void
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}
