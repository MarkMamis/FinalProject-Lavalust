<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

class EmployeeModel extends Model
{
    protected $table = 'employees';
    protected $primary_key = 'id';

    public function __construct()
    {
        parent::__construct();
    }

    public function get_all()
    {
        $res = $this->db->table($this->table)->get();
        if (!$res) return [];
        if (is_array($res) && array_keys($res) !== range(0, count($res) - 1)) {
            return [$res];
        }
        return $res;
    }

    public function find_by_id(int $id)
    {
        $res = $this->db->table($this->table)->where('id', $id)->get();
        if (!$res) return null;
        if (is_array($res) && array_keys($res) === range(0, count($res) - 1)) {
            return count($res) ? $res[0] : null;
        }
        return $res;
    }

    public function find_by_email(string $email)
    {
        $res = $this->db->table($this->table)->where('email', $email)->get();
        if (!$res) return null;
        if (is_array($res) && array_keys($res) === range(0, count($res) - 1)) {
            return count($res) ? $res[0] : null;
        }
        return $res;
    }

    public function create_employee(array $data)
    {
        $now = date('Y-m-d H:i:s');
        $data['created_at'] = $data['created_at'] ?? $now;
        if (empty($data['employee_code'])) {
            // generate simple employee code
            $data['employee_code'] = 'EMP' . time();
        }

        try {
            $res = $this->db->table($this->table)->insert($data);
            $id = 0;
            if (method_exists($this->db, 'last_id')) {
                $id = (int)$this->db->last_id();
            }
            if (!$id && is_numeric($res)) $id = (int)$res;
            return $id ?: false;
        } catch (Exception $e) {
            error_log('[EmployeeModel::create_employee] Exception: ' . $e->getMessage());
            return false;
        }
    }

    public function delete_employee(int $id)
    {
        return $this->db->table($this->table)->where('id', $id)->delete();
    }
}
