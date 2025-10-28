<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

class Employees extends Controller {
    protected $EmployeeModel;

    public function __construct()
    {
        parent::__construct();
        $this->call->model('EmployeeModel');
        $this->EmployeeModel = new EmployeeModel();
        // UserModel will be loaded on demand when creating user account
    }

    /**
     * GET /api/employees
     */
    public function index()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $rows = $this->EmployeeModel->get_all();
            echo json_encode(['employees' => $rows]);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch employees', 'detail' => $e->getMessage()]);
            exit;
        }
    }

    /**
     * POST /api/employees
     * Create employee and an associated user with default password demo123
     */
    public function create()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (strtoupper($method) !== 'POST') {
            http_response_code(405);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Method Not Allowed']);
            exit;
        }

        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $is_json = stripos($contentType, 'application/json') !== false;
        $input = $is_json ? json_decode(file_get_contents('php://input'), true) : $_POST;

        $name = isset($input['name']) ? trim($input['name']) : '';
        $email = isset($input['email']) ? trim($input['email']) : '';
        $position = isset($input['position']) ? trim($input['position']) : null;
        $salary = isset($input['salary']) ? (float)$input['salary'] : 0.00;
        $department_id = isset($input['department_id']) ? (int)$input['department_id'] : null;

        // debug payload
        error_log('[Employees::create] incoming=' . json_encode($input));

        if (empty($name) || empty($email)) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Name and email are required']);
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Invalid email address']);
            exit;
        }

        // check existing employee email or user email
        $existingEmp = $this->EmployeeModel->find_by_email($email);
        if ($existingEmp) {
            http_response_code(409);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Employee with this email already exists']);
            exit;
        }

        // Check users table for existing user
        $this->call->model('UserModel');
        $UserModel = new UserModel();
        $existingUser = $UserModel->find_by_email($email);
        if ($existingUser) {
            http_response_code(409);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'User with this email already exists']);
            exit;
        }

        $data = [
            'name' => $name,
            'email' => $email,
            'position' => $position,
            'salary' => number_format((float)$salary, 2, '.', ''),
            'department_id' => $department_id,
            'status' => 'active'
        ];

        try {
            $empId = $this->EmployeeModel->create_employee($data);
            if ($empId === false) {
                throw new Exception('Failed to insert employee');
            }

            // create user with default password demo123
            $userData = [
                'email' => $email,
                'password' => 'demo123',
                'name' => $name,
                'role' => 'employee',
                'employee_id' => $empId,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s')
            ];
            $userId = $UserModel->create_user($userData);
            if ($userId === false) {
                // Optionally, rollback employee insertion or leave as-is; we'll report error
                error_log('[Employees::create] user create failed for email=' . $email);
            }

            $created = $this->EmployeeModel->find_by_id($empId);
            http_response_code(201);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['success' => true, 'employee' => $created, 'user_id' => $userId]);
            exit;
        } catch (Exception $e) {
            error_log('[Employees::create] Exception: ' . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to create employee', 'detail' => $e->getMessage()]);
            exit;
        }
    }

    public function delete()
    {
        // similar to Departments::delete if needed
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (strtoupper($method) !== 'POST') {
            http_response_code(405);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Method Not Allowed']);
            exit;
        }
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $is_json = stripos($contentType, 'application/json') !== false;
        $input = $is_json ? json_decode(file_get_contents('php://input'), true) : $_POST;
        $id = isset($input['id']) ? (int)$input['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : 0);
        if (!$id) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Missing id']);
            exit;
        }
        try {
            $ok = $this->EmployeeModel->delete_employee($id);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['success' => (bool)$ok]);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to delete employee', 'detail' => $e->getMessage()]);
            exit;
        }
    }
}
