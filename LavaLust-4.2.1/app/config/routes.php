<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');
/**
 * ------------------------------------------------------------------
 * LavaLust - an opensource lightweight PHP MVC Framework
 * ------------------------------------------------------------------
 *
 * MIT License
 *
 * Copyright (c) 2020 Ronald M. Marasigan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @package LavaLust
 * @author Ronald M. Marasigan <ronald.marasigan@yahoo.com>
 * @since Version 1
 * @link https://github.com/ronmarasigan/LavaLust
 * @license https://opensource.org/licenses/MIT MIT License
 */

/*
| -------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------
| Here is where you can register web routes for your application.
|
|
*/

$router->get('/', 'Welcome::index');

// API: Users
// API endpoint
$router->post('/api/users', 'Users::create');

// Registration form (server-rendered)
$router->get('/register', 'Users::register');
$router->post('/register', 'Users::create');

// Login routes (supports form and API). Use match() for GET|POST on /login as requested.
$router->match('/login', 'Users::login', ['GET', 'POST']);
$router->match('/api/login', 'Users::login', ['POST']);

// Logout and me endpoints
$router->post('/api/logout', 'Users::logout');
$router->get('/api/me', 'Users::me');

// Departments API
$router->get('/api/departments', 'Departments::index');
$router->post('/api/departments', 'Departments::create');
// simple delete endpoint (expects id in body or query string)
$router->post('/api/departments/delete', 'Departments::delete');

// Employees API
$router->get('/api/employees', 'Employees::index');
$router->post('/api/employees', 'Employees::create');
$router->post('/api/employees/delete', 'Employees::delete');