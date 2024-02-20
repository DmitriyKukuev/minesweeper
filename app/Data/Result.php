<?php

namespace App\Data;

class Result
{
    protected array $errors = [];
    protected array $data = [];

    public function isSuccess(): bool
    {
        return empty($this->errors);
    }

    public function addError(string $text, string $key = ''): static
    {
        if (empty($key)) {
            $this->errors[] = $text;
        } else {
            $this->errors[$key] = $text;
        }

        return $this;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function set(string $key, mixed $value): static
    {
        $this->data[$key] = $value;
        return $this;
    }

    public function get(string $key): mixed
    {
        return $this->data[$key] ?? null;
    }

    public function getData(): array
    {
        return $this->data;
    }
}
