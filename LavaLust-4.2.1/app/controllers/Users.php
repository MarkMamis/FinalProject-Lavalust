<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

class Users extends Controller {
    protected $UserModel;

    public function __construct()
    {
        parent::__construct();
        // load model using loader helper
        $this->call->model('UserModel');
        // instantiate model reference
        $this->UserModel = new UserModel();
    }
    /**
     * Show registration form (server-rendered)
     * GET /register
     */
    public function register()
    {
        // Render the registration view: app/views/users/register.php
        $this->call->view('users/register');
    }

    /**
     * Create new user account (API or form)
     * POST /api/users  (API)
     * POST /register  (Form)
     * Accepts JSON or form data: email, password, role
     */
    public function create()
    {
        // Only allow POST
        if (isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
            // If form request, redirect back with error
            $is_form = !empty($_POST) && (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') === false);
            if ($is_form) {
                header('Location: /register?error=' . urlencode('Method Not Allowed'));
                exit;
            }
            http_response_code(405);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Method Not Allowed']);
            exit;
        }

        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $is_json = stripos($contentType, 'application/json') !== false;
        $input = $is_json ? json_decode(file_get_contents('php://input'), true) : $_POST;
        $is_form = !$is_json && !empty($_POST);

        $email = isset($input['email']) ? trim($input['email']) : '';
        $password = isset($input['password']) ? $input['password'] : '';
        $role = isset($input['role']) ? trim($input['role']) : 'employee';

        // Basic validation
        if (empty($email) || empty($password)) {
            if ($is_form) {
                header('Location: /register?error=' . urlencode('Email and password are required'));
                exit;
            }
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Email and password are required']);
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            if ($is_form) {
                header('Location: /register?error=' . urlencode('Invalid email address'));
                exit;
            }
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Invalid email address']);
            exit;
        }

        $allowed_roles = ['admin', 'hr', 'employee'];
        if (!in_array($role, $allowed_roles, true)) {
            if ($is_form) {
                header('Location: /register?error=' . urlencode('Invalid role specified'));
                exit;
            }
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Invalid role specified']);
            exit;
        }

        // Check existing email via model
        $existing = $this->UserModel->find_by_email($email);
        if ($existing) {
            if ($is_form) {
                header('Location: /register?error=' . urlencode('Email already exists'));
                exit;
            }
            http_response_code(409);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Email already exists']);
            exit;
        }

        // Hash password
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        $data = [
            'email' => $email,
            'password_hash' => $password_hash,
            'role' => $role,
            'is_active' => 1,
            'created_at' => date('Y-m-d H:i:s')
        ];

        try {
            $id = $this->UserModel->create_user($data);
            if ($is_form) {
                header('Location: /register?success=1');
                exit;
            }
            http_response_code(201);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['success' => true, 'id' => $id]);
            exit;
        } catch (Exception $e) {
            if ($is_form) {
                header('Location: /register?error=' . urlencode('Failed to create user'));
                exit;
            }
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to create user', 'detail' => $e->getMessage()]);
            exit;
        }
    }

    /**
     * Login (supports form and JSON API)
     * GET /login => render form
     * POST /login or POST /api/login => authenticate
     */
    public function login()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $is_json = stripos($contentType, 'application/json') !== false;

        // Render login form on GET
        if (strtoupper($method) === 'GET') {
            $this->call->view('users/login');
            return;
        }

        // Only POST for authentication
        if (strtoupper($method) !== 'POST') {
            http_response_code(405);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Method Not Allowed']);
            exit;
        }

        $input = $is_json ? json_decode(file_get_contents('php://input'), true) : $_POST;
        $email = isset($input['email']) ? trim($input['email']) : '';
        $password = isset($input['password']) ? $input['password'] : '';

        if (empty($email) || empty($password)) {
            if ($is_json) {
                http_response_code(400);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'Email and password are required']);
                exit;
            }
            header('Location: /login?error=' . urlencode('Email and password are required'));
            exit;
        }

        // Lookup user via model
        $user = $this->UserModel->find_by_email($email);
        if (!$user) {
            if ($is_json) {
                http_response_code(401);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'Invalid credentials']);
                exit;
            }
            header('Location: /login?error=' . urlencode('Invalid credentials'));
            exit;
        }

        if (!password_verify($password, $user['password_hash'])) {
            if ($is_json) {
                http_response_code(401);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'Invalid credentials']);
                exit;
            }
            header('Location: /login?error=' . urlencode('Invalid credentials'));
            exit;
        }

        if (isset($user['is_active']) && !$user['is_active']) {
            if ($is_json) {
                http_response_code(403);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'Account disabled']);
                exit;
            }
            header('Location: /login?error=' . urlencode('Account disabled'));
            exit;
        }

        // Start session and set minimal user info
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        // DEBUG: session environment
        error_log('[Users::login] session_save_path=' . ini_get('session.save_path'));
        $sessFile = rtrim(ini_get('session.save_path'), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'sess_' . session_id();
        error_log('[Users::login] session_file_exists=' . (file_exists($sessFile) ? '1' : '0') . ' path=' . $sessFile);
        error_log('[Users::login] before_set_SESSION=' . json_encode($_SESSION));
        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'] ?? 'employee'
        ];

        // Ensure session is written to storage before returning response
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_write_close();
            error_log('[Users::login] session_write_close called, session_file_exists_after=' . (file_exists(rtrim(ini_get('session.save_path'), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'sess_' . session_id()) ? '1' : '0'));
        }

        // DEBUG: log session and header status to help diagnose cookie/session issues
        error_log('[Users::login] session_status=' . session_status() . ' session_id=' . session_id());
        error_log('[Users::login] headers_sent=' . (headers_sent() ? '1' : '0'));
        // log headers that will be sent (may not include Set-Cookie if already sent)
        error_log('[Users::login] headers_list=' . json_encode(headers_list()));
    error_log('[Users::login] after_set_SESSION=' . json_encode($_SESSION));

        if ($is_json) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['success' => true, 'user' => $_SESSION['user']]);
            exit;
        }

        // For form, redirect to home or intended page
        header('Location: /');
        exit;
    }

    /**
     * Logout endpoint (POST /api/logout or GET /logout)
     */
    public function logout()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        // Clear session
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'], $params['secure'], $params['httponly']
            );
        }
        session_destroy();

        // Respond JSON or redirect
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $is_json = stripos($contentType, 'application/json') !== false;
        if ($is_json || strtoupper($method) === 'POST') {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['success' => true]);
            exit;
        }
        header('Location: /');
        exit;
    }

    /**
     * Return current authenticated user (GET /api/me)
     */
    public function me()
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        // DEBUG: log session and cookie info for /api/me
        error_log('[Users::me] session_status=' . session_status() . ' session_id=' . session_id());
        error_log('[Users::me] cookies=' . json_encode($_COOKIE));
        error_log('[Users::me] session_save_path=' . ini_get('session.save_path'));
        $sessFile = rtrim(ini_get('session.save_path'), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'sess_' . session_id();
        error_log('[Users::me] session_file_exists=' . (file_exists($sessFile) ? '1' : '0') . ' path=' . $sessFile);
        error_log('[Users::me] SESSION=' . json_encode($_SESSION));
        header('Content-Type: application/json; charset=utf-8');
        if (!empty($_SESSION['user'])) {
            echo json_encode(['user' => $_SESSION['user']]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthenticated']);
        }
        exit;
    }
}
