<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

/**
 * UserModel
 * Encapsulates user persistence and related DB operations.
 */
class UserModel extends Model
{
    protected $table = 'users';
    protected $primary_key = 'id';

    public function __construct()
    {
        parent::__construct();
        // Database is expected to be autoloaded by the framework.
    }

    /**
     * Find user by email
     * @param string $email
     * @return array|null
     */
    public function find_by_email(string $email)
    {
        // The framework's Database wrapper exposes ->get() which may return
        // a single row or an array. Use get() and normalize the result to
        // return a single associative row or null.
        $res = $this->db->table($this->table)->where('email', $email)->get();
        if (is_array($res)) {
            // If it's a numeric-indexed array (multiple rows), return first
            if (array_keys($res) === range(0, count($res) - 1)) {
                return count($res) ? $res[0] : null;
            }
            // Otherwise assume it's an associative single row
            return $res;
        }
        return $res ?: null;
    }

    /**
     * Create a new user. Accepts plain password or password_hash.
     * Returns inserted id or false on failure.
     */
    public function create_user(array $data)
    {
        if (!empty($data['password'])) {
            $data['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
            unset($data['password']);
        }

        $data['is_active'] = $data['is_active'] ?? 1;
        $data['created_at'] = $data['created_at'] ?? date('Y-m-d H:i:s');

        // Avoid using transaction helpers in case the Database wrapper doesn't implement them.
        try {
            $res = $this->db->table($this->table)->insert($data);
            $id = 0;
            if (method_exists($this->db, 'last_id')) {
                $id = (int)$this->db->last_id();
            }
            if (!$id && is_numeric($res)) {
                $id = (int)$res;
            }
            return $id ?: false;
        } catch (Exception $e) {
            error_log('[UserModel::create_user] Exception: ' . $e->getMessage());
            return false;
        }
    }

    public function update_user(int $id, array $data)
    {
        if (!empty($data['password'])) {
            $data['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
            unset($data['password']);
        }
        $data['updated_at'] = date('Y-m-d H:i:s');
        return $this->db->table($this->table)->where('id', $id)->update($data);
    }

    public function delete_user(int $id)
    {
        return $this->db->table($this->table)->where('id', $id)->delete();
    }

}
