<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function getAll(): Collection
    {
        return $this->model->all();
    }

    public function getById(int $id): ?User
    {
        return $this->model->find($id);
    }

    public function update(int $id, array $data): ?User
    {
        $user = $this->getById($id);
        if ($user) {
            
            if (isset($data['role'])) {
                unset($data['role']);
            }
            $user->update($data);
            return $user;
        }
        return null;
    }

    public function delete(int $id): bool
    {
        $user = $this->getById($id);
        if ($user) {
            return $user->delete();
        }
        return false;
    }
}