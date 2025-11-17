-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 16, 2025 at 03:26 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `payrolldb`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int UNSIGNED NOT NULL,
  `employee_id` int UNSIGNED NOT NULL,
  `attendance_date` date NOT NULL,
  `check_in` datetime DEFAULT NULL,
  `check_out` datetime DEFAULT NULL,
  `status` enum('present','absent','late','half-day') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'present',
  `leave_type` enum('vacation','sick','maternity','paternity','emergency','study') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `employee_id`, `attendance_date`, `check_in`, `check_out`, `status`, `leave_type`, `note`, `created_at`, `updated_at`) VALUES
(1, 14, '2025-11-03', '2025-11-03 08:00:00', '2025-11-03 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL),
(2, 14, '2025-11-04', '2025-11-04 08:00:00', '2025-11-04 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL),
(3, 14, '2025-11-05', '2025-11-05 08:00:00', '2025-11-05 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL),
(4, 14, '2025-11-06', '2025-11-06 08:00:00', '2025-11-06 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL),
(5, 14, '2025-11-07', '2025-11-07 08:00:00', '2025-11-07 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL),
(6, 14, '2025-11-10', '2025-11-10 08:00:00', '2025-11-10 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL),
(7, 14, '2025-11-11', '2025-11-11 08:00:00', '2025-11-11 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL),
(8, 14, '2025-11-12', '2025-11-12 08:00:00', '2025-11-12 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL),
(9, 14, '2025-11-13', '2025-11-13 08:00:00', '2025-11-13 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL),
(10, 14, '2025-11-14', '2025-11-14 08:00:00', '2025-11-14 17:00:00', 'present', NULL, NULL, '2025-11-16 08:50:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `class_schedules`
--

CREATE TABLE `class_schedules` (
  `id` int UNSIGNED NOT NULL,
  `subject_id` int NOT NULL,
  `employee_id` int UNSIGNED NOT NULL,
  `section_id` int UNSIGNED NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `class_schedules`
--

INSERT INTO `class_schedules` (`id`, `subject_id`, `employee_id`, `section_id`, `day_of_week`, `start_time`, `end_time`, `room_code`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2, 12, 1, 'Monday', '08:00:00', '10:00:00', 'ITRM107', 1, '2025-11-05 12:18:54', NULL),
(2, 2, 12, 1, 'Tuesday', '10:00:00', '12:00:00', 'ITRM107', 1, '2025-11-05 12:20:20', NULL),
(4, 1, 5, 1, 'Wednesday', '13:00:00', '14:30:00', 'ITRM107', 0, '2025-11-05 12:20:43', '2025-11-15 21:06:50'),
(5, 1, 5, 1, 'Friday', '15:00:00', '16:30:00', 'ITRM202', 0, '2025-11-05 12:21:24', '2025-11-15 21:06:51'),
(6, 2, 6, 1, 'Thursday', '14:00:00', '15:30:00', 'ITRM201', 0, '2025-11-05 12:21:41', '2025-11-15 18:01:08'),
(7, 2, 6, 2, 'Saturday', '09:00:00', '10:30:00', 'ITRM202', 1, '2025-11-05 12:22:45', NULL),
(8, 1, 11, 2, 'Monday', '11:00:00', '12:30:00', 'ITRM101', 0, '2025-11-05 12:23:10', '2025-11-15 21:06:42'),
(9, 1, 11, 2, 'Tuesday', '11:00:00', '12:30:00', 'ITRM101', 0, '2025-11-05 12:24:27', '2025-11-15 21:06:44'),
(10, 1, 6, 2, 'Wednesday', '09:00:00', '10:30:00', 'ITRM101', 0, '2025-11-05 12:24:44', '2025-11-15 21:06:46'),
(11, 9, 11, 7, 'Monday', '08:00:00', '11:00:00', 'ITRM201', 1, '2025-11-05 20:04:03', NULL),
(12, 3, 14, 2, 'Monday', '08:00:00', '10:00:00', 'ITRM101', 1, '2025-11-15 20:16:49', NULL),
(13, 2, 13, 3, 'Monday', '08:00:00', '10:00:00', 'ITRM102', 1, '2025-11-15 20:25:09', NULL),
(14, 3, 14, 1, 'Tuesday', '13:00:00', '15:00:00', 'ITRM102', 0, '2025-11-15 20:39:16', '2025-11-15 21:38:08'),
(15, 15, 14, 8, 'Monday', '13:00:00', '16:00:00', 'ITRM106', 1, '2025-11-15 20:42:41', NULL),
(16, 15, 14, 8, 'Tuesday', '08:00:00', '10:00:00', 'ITRM106', 1, '2025-11-15 21:15:06', NULL),
(17, 3, 14, 1, 'Monday', '16:00:00', '18:00:00', 'ITRM106', 1, '2025-11-15 21:24:21', NULL),
(18, 3, 14, 2, 'Tuesday', '10:00:00', '13:00:00', 'ITRM202', 1, '2025-11-15 21:25:40', NULL),
(19, 3, 14, 3, 'Tuesday', '15:00:00', '17:00:00', 'ITRM106', 1, '2025-11-15 21:26:33', NULL),
(20, 15, 14, 7, 'Friday', '08:00:00', '10:00:00', 'ITRM106', 1, '2025-11-15 21:28:02', NULL),
(21, 15, 14, 7, 'Thursday', '15:00:00', '18:00:00', 'ITRM106', 1, '2025-11-15 21:29:46', NULL),
(22, 11, 14, 5, 'Wednesday', '14:00:00', '16:00:00', 'ITRM106', 1, '2025-11-15 21:31:11', NULL),
(23, 11, 14, 6, 'Wednesday', '08:00:00', '11:00:00', 'ITRM202', 1, '2025-11-15 21:32:07', NULL),
(24, 11, 14, 6, 'Thursday', '08:00:00', '10:00:00', 'ITRM106', 1, '2025-11-15 21:34:19', NULL),
(25, 11, 14, 5, 'Friday', '13:00:00', '16:00:00', 'ITRM202', 1, '2025-11-15 21:34:50', NULL),
(26, 3, 14, 3, 'Wednesday', '11:00:00', '14:00:00', 'ITRM202', 1, '2025-11-15 21:37:50', NULL),
(27, 3, 14, 1, 'Thursday', '10:00:00', '12:00:00', 'ITRM106', 1, '2025-11-15 21:39:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `class_sections`
--

CREATE TABLE `class_sections` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `class_sections`
--

INSERT INTO `class_sections` (`id`, `name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'BSIT-1F1', 1, '2025-11-05 17:27:26', NULL),
(2, 'BSIT-1F2', 1, '2025-11-05 17:27:26', NULL),
(3, 'BSIT-1F3', 1, '2025-11-05 17:27:26', NULL),
(4, 'BSIT-1F4', 1, '2025-11-05 17:27:26', NULL),
(5, 'BSIT-2F1', 1, '2025-11-05 17:27:26', NULL),
(6, 'BSIT-2F2', 1, '2025-11-05 17:27:26', NULL),
(7, 'BSIT-2F3', 1, '2025-11-05 17:27:26', NULL),
(8, 'BSIT-2F4', 1, '2025-11-05 17:27:26', NULL),
(9, 'BSIT-3F1', 1, '2025-11-05 17:27:26', NULL),
(10, 'BSIT-3F2', 1, '2025-11-05 17:27:26', NULL),
(11, 'BSIT-3F3', 1, '2025-11-05 17:27:26', NULL),
(12, 'BSIT-3F4', 1, '2025-11-05 17:27:26', NULL),
(13, 'BSIT-4F1', 1, '2025-11-05 17:27:26', NULL),
(14, 'BSIT-4F2', 1, '2025-11-05 17:27:26', NULL),
(15, 'BSIT-4F3', 1, '2025-11-05 17:27:26', NULL),
(16, 'BSIT-4F4', 1, '2025-11-05 17:27:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `deduction_rates`
--

CREATE TABLE `deduction_rates` (
  `id` int UNSIGNED NOT NULL,
  `deduction_type` enum('gsis','philhealth','pagibig','tax','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `rate_type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `rate_value` decimal(10,2) NOT NULL,
  `min_amount` decimal(10,2) DEFAULT NULL,
  `max_amount` decimal(10,2) DEFAULT NULL,
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deduction_rates`
--

INSERT INTO `deduction_rates` (`id`, `deduction_type`, `description`, `rate_type`, `rate_value`, `min_amount`, `max_amount`, `salary_min`, `salary_max`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'gsis', 'GSIS Employee Contribution - Standard Rate', 'percentage', 9.00, NULL, NULL, 0.00, 999999.00, 1, '2025-11-16 11:00:53', NULL),
(5, 'pagibig', 'Pag-IBIG Contribution - Below 1500', 'percentage', 1.00, NULL, NULL, 0.00, 1500.00, 1, '2025-11-16 11:00:53', NULL),
(6, 'pagibig', 'Pag-IBIG Contribution - Above 1500', 'percentage', 2.00, NULL, 100.00, 1501.00, 999999.00, 1, '2025-11-16 11:00:53', NULL),
(11, 'pagibig', 'Pag-IBIG Contribution - Below 1500', 'percentage', 1.00, NULL, NULL, 0.00, 1500.00, 1, '2025-11-16 11:01:16', NULL),
(12, 'pagibig', 'Pag-IBIG Contribution - Above 1500', 'percentage', 2.00, NULL, 100.00, 1501.00, 999999.00, 1, '2025-11-16 11:01:16', NULL),
(13, 'philhealth', 'PhilHealth Premium - 2024-2025 Standard Rate', 'percentage', 5.00, 500.00, 5000.00, 0.00, 999999.00, 1, '2025-11-16 11:33:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(8, 'College of Computer Studies', 'Bachelor of Science in Information Technology', '2025-11-06 03:13:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int UNSIGNED NOT NULL,
  `employee_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int UNSIGNED DEFAULT NULL,
  `department_id` int UNSIGNED DEFAULT NULL,
  `position_id` int UNSIGNED DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `salary_grade` tinyint UNSIGNED DEFAULT NULL COMMENT 'e.g., 11 to 33',
  `step_increment` tinyint UNSIGNED DEFAULT '1' COMMENT '1 to 8 steps within grade'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_code`, `user_id`, `department_id`, `position_id`, `join_date`, `status`, `avatar`, `created_at`, `updated_at`, `salary_grade`, `step_increment`) VALUES
(5, 'EMP001', 7, 8, 25, '2025-11-05', 'active', NULL, '2025-11-05 11:37:03', '2025-11-16 10:21:15', 11, 1),
(6, 'EMP002', 8, 8, 23, '2025-11-05', 'active', NULL, '2025-11-05 11:42:58', '2025-11-16 10:21:15', 21, 1),
(11, 'EMP003', 9, 8, 22, '2025-11-05', 'active', NULL, '2025-11-05 11:46:33', '2025-11-16 10:21:15', 20, 1),
(12, 'EMP004', 10, 8, 30, '2025-11-05', 'active', NULL, '2025-11-05 11:47:19', '2025-11-16 10:21:15', 16, 1),
(13, 'EMP005', 11, 8, 30, '2025-11-06', 'active', NULL, '2025-11-05 20:09:04', '2025-11-16 10:21:15', 16, 1),
(14, 'EMP006', 12, 8, 23, '2026-01-01', 'active', NULL, '2025-11-06 02:11:20', '2025-11-16 10:21:15', 21, 1),
(20, 'EMP007', 20, NULL, NULL, NULL, 'active', NULL, '2025-11-15 22:10:37', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` int UNSIGNED NOT NULL,
  `employee_id` int UNSIGNED NOT NULL,
  `type` enum('vacation','sick','maternity','paternity','emergency','study') COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll_periods`
--

CREATE TABLE `payroll_periods` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('open','locked','processed') COLLATE utf8mb4_unicode_ci DEFAULT 'open',
  `cut_off_date` date DEFAULT NULL COMMENT 'Deadline for timekeeping submission',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payroll_periods`
--

INSERT INTO `payroll_periods` (`id`, `name`, `start_date`, `end_date`, `status`, `cut_off_date`, `created_at`, `updated_at`) VALUES
(1, 'November 2025 - 1st Half', '2025-11-01', '2025-11-15', 'open', NULL, '2025-11-16 03:52:31', NULL),
(3, 'November 2025 - 2nd Half', '2025-11-16', '2025-11-30', 'locked', NULL, '2025-11-16 06:07:28', '2025-11-16 06:17:40');

-- --------------------------------------------------------

--
-- Table structure for table `payroll_records`
--

CREATE TABLE `payroll_records` (
  `id` int UNSIGNED NOT NULL,
  `employee_id` int UNSIGNED NOT NULL,
  `period_month` date NOT NULL,
  `net_salary` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','processed','paid') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `processed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `period_id` int UNSIGNED DEFAULT NULL,
  `basic_salary` decimal(12,2) NOT NULL DEFAULT '0.00',
  `days_worked` decimal(4,2) DEFAULT '0.00',
  `days_absent` decimal(4,2) DEFAULT '0.00',
  `late_minutes_total` int DEFAULT '0',
  `allowance_rla` decimal(10,2) DEFAULT '1500.00' COMMENT 'Representation & Laundry Allowance',
  `honorarium` decimal(10,2) DEFAULT '0.00',
  `overtime_pay` decimal(10,2) DEFAULT '0.00',
  `deduction_gsis` decimal(10,2) DEFAULT '0.00',
  `deduction_philhealth` decimal(10,2) DEFAULT '0.00',
  `deduction_pagibig` decimal(10,2) DEFAULT '0.00',
  `deduction_tax` decimal(10,2) DEFAULT '0.00',
  `other_deductions` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payroll_records`
--

INSERT INTO `payroll_records` (`id`, `employee_id`, `period_month`, `net_salary`, `status`, `processed_at`, `created_at`, `updated_at`, `period_id`, `basic_salary`, `days_worked`, `days_absent`, `late_minutes_total`, `allowance_rla`, `honorarium`, `overtime_pay`, `deduction_gsis`, `deduction_philhealth`, `deduction_pagibig`, `deduction_tax`, `other_deductions`) VALUES
(1, 14, '2025-11-01', 41432.95, 'pending', NULL, '2025-11-16 03:52:40', NULL, 1, 50570.00, 10.00, 0.00, 0, 1500.00, 0.00, 0.00, 4551.30, 1517.10, 200.00, 4368.65, 0.00),
(14, 13, '2025-11-01', 0.00, 'pending', NULL, '2025-11-16 06:34:02', NULL, 1, 0.00, 0.00, 10.00, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` int UNSIGNED NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `salary_grade` tinyint UNSIGNED DEFAULT NULL COMMENT 'Standard SG for this position'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `title`, `department_id`, `description`, `created_at`, `updated_at`, `salary_grade`) VALUES
(21, 'Associate Professor I', 8, NULL, '2025-11-05 20:48:12', '2025-11-16 09:51:36', 19),
(22, 'Associate Professor II', 8, NULL, '2025-11-05 20:48:16', '2025-11-16 09:51:36', 20),
(23, 'Associate Professor III', 8, NULL, '2025-11-05 20:48:20', '2025-11-16 09:51:36', 21),
(24, 'Associate Professor IV', 8, NULL, '2025-11-05 20:48:42', '2025-11-16 09:51:36', 22),
(25, 'Instructor I', 8, NULL, '2025-11-05 20:48:58', '2025-11-16 09:51:35', 11),
(26, 'Instructor II', 8, NULL, '2025-11-05 20:49:05', '2025-11-16 09:51:36', 12),
(27, 'Instructor III', 8, NULL, '2025-11-05 20:49:09', '2025-11-16 09:51:36', 13),
(28, 'Instructor IV', 8, NULL, '2025-11-05 20:49:13', '2025-11-16 09:51:36', 14),
(29, 'Assistant Professor I', 8, NULL, '2025-11-05 20:49:41', '2025-11-16 09:51:36', 15),
(30, 'Assistant Professor II', 8, NULL, '2025-11-05 20:49:45', '2025-11-16 09:51:36', 16),
(31, 'Assistant Professor III', 8, NULL, '2025-11-05 20:49:49', '2025-11-16 09:51:36', 17),
(32, 'Assistant Professor IV', 8, NULL, '2025-11-05 20:49:52', '2025-11-16 09:51:36', 18),
(34, 'Computer Laboratory Technician', 8, NULL, '2025-11-05 20:51:46', '2025-11-16 09:51:36', 11);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `floor` enum('1st Floor','2nd Floor') NOT NULL,
  `type` enum('Classroom','Laboratory') NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `code`, `name`, `floor`, `type`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'ITRM201', 'IT Room 201', '2nd Floor', 'Laboratory', 1, '2025-11-05 10:04:36', '2025-11-15 18:02:33'),
(2, 'ITRM202', 'IT Room 202', '2nd Floor', 'Laboratory', 1, '2025-11-05 10:04:53', '2025-11-05 17:04:53'),
(3, 'ITRM101', 'IT Room 101', '1st Floor', 'Classroom', 1, '2025-11-05 10:05:07', '2025-11-05 20:05:39'),
(4, 'ITRM102', 'IT Room 102', '1st Floor', 'Classroom', 1, '2025-11-05 10:05:19', '2025-11-05 17:05:19'),
(5, 'ITRM103', 'IT Room 103', '1st Floor', 'Classroom', 0, '2025-11-05 10:05:30', '2025-11-05 10:06:30'),
(6, 'ITRM104', 'IT Room 104', '1st Floor', 'Classroom', 1, '2025-11-05 10:05:39', '2025-11-05 17:05:39'),
(7, 'ITRM105', 'IT Room 105', '1st Floor', 'Classroom', 1, '2025-11-05 10:05:52', '2025-11-05 17:05:52'),
(8, 'ITRM106', 'IT Room 106', '1st Floor', 'Classroom', 1, '2025-11-05 10:06:02', '2025-11-05 17:06:02'),
(9, 'ITRM107', 'IT Room 107', '1st Floor', 'Classroom', 1, '2025-11-05 10:06:11', '2025-11-05 17:06:11'),
(10, 'ITRM108', 'IT Room 108', '1st Floor', 'Classroom', 1, '2025-11-05 10:06:22', '2025-11-05 17:06:22');

-- --------------------------------------------------------

--
-- Table structure for table `salary_grades`
--

CREATE TABLE `salary_grades` (
  `id` int UNSIGNED NOT NULL,
  `salary_grade` tinyint UNSIGNED NOT NULL,
  `step` tinyint UNSIGNED NOT NULL,
  `monthly_salary` decimal(12,2) NOT NULL,
  `effective_date` date DEFAULT '2023-01-01'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salary_grades`
--

INSERT INTO `salary_grades` (`id`, `salary_grade`, `step`, `monthly_salary`, `effective_date`) VALUES
(1, 11, 1, 30697.00, '2023-01-01'),
(2, 11, 2, 31880.00, '2023-01-01'),
(3, 11, 3, 33105.00, '2023-01-01'),
(4, 11, 4, 34370.00, '2023-01-01'),
(5, 11, 5, 35678.00, '2023-01-01'),
(6, 11, 6, 37030.00, '2023-01-01'),
(7, 11, 7, 38427.00, '2023-01-01'),
(8, 11, 8, 39870.00, '2023-01-01'),
(9, 12, 1, 32428.00, '2023-01-01'),
(10, 12, 2, 33755.00, '2023-01-01'),
(11, 12, 3, 35130.00, '2023-01-01'),
(12, 12, 4, 36550.00, '2023-01-01'),
(13, 12, 5, 38018.00, '2023-01-01'),
(14, 12, 6, 39530.00, '2023-01-01'),
(15, 12, 7, 41090.00, '2023-01-01'),
(16, 12, 8, 42700.00, '2023-01-01'),
(17, 13, 1, 34305.00, '2023-01-01'),
(18, 13, 2, 35780.00, '2023-01-01'),
(19, 13, 3, 37310.00, '2023-01-01'),
(20, 13, 4, 38890.00, '2023-01-01'),
(21, 13, 5, 40520.00, '2023-01-01'),
(22, 13, 6, 42210.00, '2023-01-01'),
(23, 13, 7, 43950.00, '2023-01-01'),
(24, 13, 8, 45750.00, '2023-01-01'),
(25, 14, 1, 36335.00, '2023-01-01'),
(26, 14, 2, 37890.00, '2023-01-01'),
(27, 14, 3, 39500.00, '2023-01-01'),
(28, 14, 4, 41170.00, '2023-01-01'),
(29, 14, 5, 42900.00, '2023-01-01'),
(30, 14, 6, 44700.00, '2023-01-01'),
(31, 14, 7, 46560.00, '2023-01-01'),
(32, 14, 8, 48490.00, '2023-01-01'),
(33, 15, 1, 38520.00, '2023-01-01'),
(34, 15, 2, 40180.00, '2023-01-01'),
(35, 15, 3, 41900.00, '2023-01-01'),
(36, 15, 4, 43680.00, '2023-01-01'),
(37, 15, 5, 45530.00, '2023-01-01'),
(38, 15, 6, 47450.00, '2023-01-01'),
(39, 15, 7, 49440.00, '2023-01-01'),
(40, 15, 8, 51500.00, '2023-01-01'),
(41, 16, 1, 40280.00, '2023-01-01'),
(42, 16, 2, 41940.00, '2023-01-01'),
(43, 16, 3, 43660.00, '2023-01-01'),
(44, 16, 4, 45440.00, '2023-01-01'),
(45, 16, 5, 47290.00, '2023-01-01'),
(46, 16, 6, 49210.00, '2023-01-01'),
(47, 16, 7, 51200.00, '2023-01-01'),
(48, 16, 8, 53260.00, '2023-01-01'),
(49, 17, 1, 42150.00, '2023-01-01'),
(50, 17, 2, 43870.00, '2023-01-01'),
(51, 17, 3, 45650.00, '2023-01-01'),
(52, 17, 4, 47500.00, '2023-01-01'),
(53, 17, 5, 49420.00, '2023-01-01'),
(54, 17, 6, 51410.00, '2023-01-01'),
(55, 17, 7, 53480.00, '2023-01-01'),
(56, 17, 8, 55620.00, '2023-01-01'),
(57, 18, 1, 44110.00, '2023-01-01'),
(58, 18, 2, 45930.00, '2023-01-01'),
(59, 18, 3, 47820.00, '2023-01-01'),
(60, 18, 4, 49780.00, '2023-01-01'),
(61, 18, 5, 51810.00, '2023-01-01'),
(62, 18, 6, 53910.00, '2023-01-01'),
(63, 18, 7, 56090.00, '2023-01-01'),
(64, 18, 8, 58350.00, '2023-01-01'),
(65, 19, 1, 46160.00, '2023-01-01'),
(66, 19, 2, 48110.00, '2023-01-01'),
(67, 19, 3, 50130.00, '2023-01-01'),
(68, 19, 4, 52220.00, '2023-01-01'),
(69, 19, 5, 54390.00, '2023-01-01'),
(70, 19, 6, 56640.00, '2023-01-01'),
(71, 19, 7, 58970.00, '2023-01-01'),
(72, 19, 8, 61380.00, '2023-01-01'),
(73, 20, 1, 48310.00, '2023-01-01'),
(74, 20, 2, 50370.00, '2023-01-01'),
(75, 20, 3, 52510.00, '2023-01-01'),
(76, 20, 4, 54730.00, '2023-01-01'),
(77, 20, 5, 57030.00, '2023-01-01'),
(78, 20, 6, 59410.00, '2023-01-01'),
(79, 20, 7, 61880.00, '2023-01-01'),
(80, 20, 8, 64440.00, '2023-01-01'),
(81, 21, 1, 50570.00, '2023-01-01'),
(82, 21, 2, 52740.00, '2023-01-01'),
(83, 21, 3, 54990.00, '2023-01-01'),
(84, 21, 4, 57320.00, '2023-01-01'),
(85, 21, 5, 59740.00, '2023-01-01'),
(86, 21, 6, 62250.00, '2023-01-01'),
(87, 21, 7, 64850.00, '2023-01-01'),
(88, 21, 8, 67550.00, '2023-01-01'),
(89, 22, 1, 52930.00, '2023-01-01'),
(90, 22, 2, 55220.00, '2023-01-01'),
(91, 22, 3, 57600.00, '2023-01-01'),
(92, 22, 4, 60070.00, '2023-01-01'),
(93, 22, 5, 62630.00, '2023-01-01'),
(94, 22, 6, 65280.00, '2023-01-01'),
(95, 22, 7, 68030.00, '2023-01-01'),
(96, 22, 8, 70880.00, '2023-01-01'),
(97, 23, 1, 86217.00, '2023-01-01'),
(98, 23, 2, 88533.00, '2023-01-01'),
(99, 23, 3, 90918.00, '2023-01-01'),
(100, 23, 4, 93373.00, '2023-01-01'),
(101, 23, 5, 95899.00, '2023-01-01'),
(102, 23, 6, 98498.00, '2023-01-01'),
(103, 23, 7, 101172.00, '2023-01-01'),
(104, 23, 8, 103922.00, '2023-01-01'),
(105, 24, 1, 93897.00, '2023-01-01'),
(106, 24, 2, 96404.00, '2023-01-01'),
(107, 24, 3, 98986.00, '2023-01-01'),
(108, 24, 4, 101645.00, '2023-01-01'),
(109, 24, 5, 104382.00, '2023-01-01'),
(110, 24, 6, 107199.00, '2023-01-01'),
(111, 24, 7, 110098.00, '2023-01-01'),
(112, 24, 8, 113080.00, '2023-01-01'),
(113, 25, 1, 102284.00, '2023-01-01'),
(114, 25, 2, 104995.00, '2023-01-01'),
(115, 25, 3, 107786.00, '2023-01-01'),
(116, 25, 4, 110659.00, '2023-01-01'),
(117, 25, 5, 113616.00, '2023-01-01'),
(118, 25, 6, 116658.00, '2023-01-01'),
(119, 25, 7, 119788.00, '2023-01-01'),
(120, 25, 8, 123007.00, '2023-01-01'),
(121, 26, 1, 111412.00, '2023-01-01'),
(122, 26, 2, 114378.00, '2023-01-01'),
(123, 26, 3, 117428.00, '2023-01-01'),
(124, 26, 4, 120563.00, '2023-01-01'),
(125, 26, 5, 123786.00, '2023-01-01'),
(126, 26, 6, 127099.00, '2023-01-01'),
(127, 26, 7, 130503.00, '2023-01-01'),
(128, 26, 8, 134001.00, '2023-01-01'),
(129, 27, 1, 121303.00, '2023-01-01'),
(130, 27, 2, 124537.00, '2023-01-01'),
(131, 27, 3, 127857.00, '2023-01-01'),
(132, 27, 4, 131265.00, '2023-01-01'),
(133, 27, 5, 134763.00, '2023-01-01'),
(134, 27, 6, 138352.00, '2023-01-01'),
(135, 27, 7, 142036.00, '2023-01-01'),
(136, 27, 8, 145816.00, '2023-01-01'),
(137, 28, 1, 132022.00, '2023-01-01'),
(138, 28, 2, 135542.00, '2023-01-01'),
(139, 28, 3, 139153.00, '2023-01-01'),
(140, 28, 4, 142858.00, '2023-01-01'),
(141, 28, 5, 146658.00, '2023-01-01'),
(142, 28, 6, 150557.00, '2023-01-01'),
(143, 28, 7, 154556.00, '2023-01-01'),
(144, 28, 8, 158657.00, '2023-01-01'),
(145, 29, 1, 143744.00, '2023-01-01'),
(146, 29, 2, 147574.00, '2023-01-01'),
(147, 29, 3, 151502.00, '2023-01-01'),
(148, 29, 4, 155530.00, '2023-01-01'),
(149, 29, 5, 159661.00, '2023-01-01'),
(150, 29, 6, 163897.00, '2023-01-01'),
(151, 29, 7, 168241.00, '2023-01-01'),
(152, 29, 8, 172695.00, '2023-01-01'),
(153, 30, 1, 156568.00, '2023-01-01'),
(154, 30, 2, 160743.00, '2023-01-01'),
(155, 30, 3, 165022.00, '2023-01-01'),
(156, 30, 4, 169408.00, '2023-01-01'),
(157, 30, 5, 173903.00, '2023-01-01'),
(158, 30, 6, 178510.00, '2023-01-01'),
(159, 30, 7, 183231.00, '2023-01-01'),
(160, 30, 8, 188068.00, '2023-01-01'),
(161, 31, 1, 170573.00, '2023-01-01'),
(162, 31, 2, 175088.00, '2023-01-01'),
(163, 31, 3, 179715.00, '2023-01-01'),
(164, 31, 4, 184456.00, '2023-01-01'),
(165, 31, 5, 189314.00, '2023-01-01'),
(166, 31, 6, 194291.00, '2023-01-01'),
(167, 31, 7, 199390.00, '2023-01-01'),
(168, 31, 8, 204613.00, '2023-01-01'),
(169, 32, 1, 185824.00, '2023-01-01'),
(170, 32, 2, 190896.00, '2023-01-01'),
(171, 32, 3, 196088.00, '2023-01-01'),
(172, 32, 4, 201403.00, '2023-01-01'),
(173, 32, 5, 206844.00, '2023-01-01'),
(174, 32, 6, 212413.00, '2023-01-01'),
(175, 32, 7, 218114.00, '2023-01-01'),
(176, 32, 8, 223949.00, '2023-01-01'),
(177, 33, 1, 202345.00, '2023-01-01'),
(178, 33, 2, 207804.00, '2023-01-01'),
(179, 33, 3, 213386.00, '2023-01-01'),
(180, 33, 4, 219094.00, '2023-01-01'),
(181, 33, 5, 224931.00, '2023-01-01'),
(182, 33, 6, 230900.00, '2023-01-01'),
(183, 33, 7, 237003.00, '2023-01-01'),
(184, 33, 8, 243243.00, '2023-01-01');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `units` int NOT NULL,
  `hours_per_week` int NOT NULL,
  `semester` enum('1st','2nd','Summer') NOT NULL,
  `school_year` varchar(10) NOT NULL COMMENT 'Format: YYYY-YYYY (e.g., 2024-2025)',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `code`, `name`, `units`, `hours_per_week`, `semester`, `school_year`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'test', 'test', 3, 3, '1st', '2024-2025', 0, '2025-11-05 09:54:59', '2025-11-05 09:55:02'),
(2, 'ITC 111', 'Intro to Computing', 3, 3, '1st', '2024-2025', 1, '2025-11-05 09:56:25', '2025-11-11 05:56:24'),
(3, 'ITC 112', 'Computer Programming 1', 3, 3, '1st', '2024-2025', 1, '2025-11-05 09:56:44', '2025-11-05 16:56:44'),
(4, 'ITC 211', 'Data Structures with Algorithm', 3, 3, '1st', '2024-2025', 1, '2025-11-05 09:57:30', '2025-11-05 16:57:30'),
(5, 'ITC 212', 'Information Management', 3, 3, '1st', '2024-2025', 1, '2025-11-05 09:58:09', '2025-11-05 09:58:34'),
(6, 'ITE 211', 'Human Computer Interaction 2', 3, 3, '1st', '2024-2025', 1, '2025-11-05 09:58:55', '2025-11-05 16:58:55'),
(7, 'ITE 212', 'Object Oriented Programming', 3, 3, '1st', '2024-2025', 1, '2025-11-05 09:59:09', '2025-11-05 16:59:09'),
(8, 'ITE 213', 'Platform Technologies', 3, 3, '1st', '2024-2025', 1, '2025-11-05 09:59:22', '2025-11-05 16:59:22'),
(9, 'ITC 121', 'Computer Programming 2', 3, 3, '2nd', '2024-2025', 1, '2025-11-05 10:00:28', '2025-11-05 10:08:31'),
(10, 'ITP 121', 'Discrete Mathematics', 3, 3, '2nd', '2024-2025', 1, '2025-11-05 10:00:55', '2025-11-05 10:08:35'),
(11, 'ITP 122', 'Intro to Human Computer Interaction 1', 3, 3, '2nd', '2024-2025', 1, '2025-11-05 10:01:05', '2025-11-05 10:10:17'),
(12, 'ITE 121', 'Electronics with Technical Drawing', 3, 3, '1st', '2024-2025', 1, '2025-11-05 10:01:19', '2025-11-05 17:01:19'),
(13, 'ITP 221', 'Advanced Database Systems', 3, 3, '1st', '2024-2025', 1, '2025-11-05 10:01:48', '2025-11-05 17:01:48'),
(14, 'ITP 222', 'Quantitative Methods', 3, 3, '1st', '2024-2025', 1, '2025-11-05 10:02:01', '2025-11-05 17:02:01'),
(15, 'ITP 223', 'Networking 1', 3, 3, '1st', '2024-2025', 1, '2025-11-05 10:02:13', '2025-11-05 17:02:13'),
(16, 'ITP 224', 'Integrative Programming and Technologies 1', 3, 3, '1st', '2024-2025', 1, '2025-11-05 10:02:24', '2025-11-05 17:02:24'),
(17, 'ITE 221', 'Web Systems and Technologies', 3, 3, '1st', '2024-2025', 1, '2025-11-05 10:02:37', '2025-11-05 17:02:37'),
(18, 'ITE 222', 'Embedded System', 3, 3, '1st', '2024-2025', 1, '2025-11-05 10:02:48', '2025-11-05 17:02:48');

-- --------------------------------------------------------

--
-- Table structure for table `tax_brackets`
--

CREATE TABLE `tax_brackets` (
  `id` int UNSIGNED NOT NULL,
  `income_from` decimal(15,2) NOT NULL,
  `income_to` decimal(15,2) NOT NULL,
  `base_tax` decimal(15,2) NOT NULL DEFAULT '0.00',
  `rate_percentage` decimal(5,2) NOT NULL,
  `excess_over` decimal(15,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tax_brackets`
--

INSERT INTO `tax_brackets` (`id`, `income_from`, `income_to`, `base_tax`, `rate_percentage`, `excess_over`, `is_active`, `created_at`, `updated_at`) VALUES
(13, 0.00, 20833.00, 0.00, 0.00, 0.00, 1, '2025-11-16 11:04:57', '2025-11-16 12:16:26'),
(14, 20833.01, 33332.00, 0.00, 15.00, 20833.00, 1, '2025-11-16 11:04:57', NULL),
(15, 33332.01, 66666.00, 1875.00, 20.00, 33332.00, 1, '2025-11-16 11:04:57', NULL),
(16, 66666.01, 166666.00, 8541.80, 25.00, 66666.00, 1, '2025-11-16 11:04:57', NULL),
(17, 166666.01, 666666.00, 33541.80, 30.00, 166666.00, 1, '2025-11-16 11:04:57', NULL),
(18, 666666.01, 999999999.00, 183541.80, 35.00, 666666.00, 1, '2025-11-16 11:04:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','hr','employee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'employee',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `password_hash`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin@payflow.com', NULL, NULL, '$2y$10$/jJOkKgsEXQHcN2C22AU3u9pCXZ6Vb3nNfKBsaBjkX0JoOcj0wfjG', 'admin', 1, NULL, '2025-10-27 18:37:01', '2025-11-16 01:43:08'),
(2, 'hr@payflow.com', NULL, NULL, '$2y$10$zYBfalOid1E/p/WIa4FKgeKb/enyvEo4pUB1TzmnajhG4uzoBEFc2', 'hr', 1, NULL, '2025-10-27 18:37:22', '2025-11-16 01:43:12'),
(3, 'employee@payflow.com', NULL, NULL, '$2y$10$htKFc0suE2jBRPl4O0hQT.qFc05NU3mTrqxtAwWyBQjTmhi3KLKB2', 'employee', 1, NULL, '2025-10-27 18:37:28', NULL),
(6, 'sample@payflow.com', NULL, NULL, '$2y$10$nR9291Es56MibkNGIRKjGOY9cmqD1/u7Qxhw3g/es/Gq8F.gQwdAK', 'employee', 1, NULL, '2025-11-02 19:18:23', NULL),
(7, 'epie.custodio@payflow.edu.ph', 'Epie', 'Custodio', '$2y$10$1LcS636W2FbImHxs7D4c0uH7EmzSmwCH60NxBVK3KhzBHYAQv6NHW', 'employee', 1, NULL, '2025-11-05 11:37:03', '2025-11-16 01:33:08'),
(8, 'regine.ponce@payflow.edu.ph', 'Regine', 'Ponce-Machete', '$2y$10$X6rJY.VPAsRZIhkNT7oqCuUcszN40hHjNHYkqe9jUbz.j1z5xZVbq', 'employee', 1, NULL, '2025-11-05 11:42:58', '2025-11-16 01:33:08'),
(9, 'fidel.romasanta@payflow.edu.ph', 'Fidel', 'Romasanta', '$2y$10$3xkd8LG2dAEEMF82JQaHDezC8SZjXcLVrKx7A5yyf6xem4Urp4N22', 'employee', 1, NULL, '2025-11-05 11:46:33', '2025-11-16 01:33:08'),
(10, 'jennifer.cupo@payflow.edu.ph', 'Jennifer', 'Cupo', '$2y$10$pcOQmV7RLXwDAXWGYidoSuTSYwWnRHUMHm3VQNbBEbZHVY2kNwbi.', 'employee', 1, NULL, '2025-11-05 11:47:19', '2025-11-16 01:33:08'),
(11, 'franklin.lopez@payflow.edu.ph', 'Franklin', 'Lopez', '$2y$10$5l4cFvvl9m40GuzNWPrHmuCBiwhru6cW0uYmL63lOLGO3IaOOrkpi', 'employee', 1, NULL, '2025-11-05 20:09:04', '2025-11-15 20:27:07'),
(12, 'kristianne.javier@payflow.edu.ph', 'Kristianne Aleza Marie', 'Javier', '$2y$10$SfY21UaFve.kcrTh4akEB.J8VdEKlFDnpHu0xmVTIsdZV2hNKiGQC', 'employee', 1, NULL, '2025-11-06 02:11:20', '2025-11-15 20:27:32'),
(20, 'edniel1222@gmail.com', 'Mark', 'Nebres', '', 'employee', 1, NULL, '2025-11-15 22:10:37', '2025-11-16 05:16:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_attendance_employee_date` (`employee_id`,`attendance_date`),
  ADD KEY `idx_attendance_date` (`attendance_date`),
  ADD KEY `idx_attendance_status` (`status`),
  ADD KEY `idx_leave_type` (`leave_type`);

--
-- Indexes for table `class_schedules`
--
ALTER TABLE `class_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_subject` (`subject_id`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_section` (`section_id`),
  ADD KEY `idx_day_time` (`day_of_week`,`start_time`),
  ADD KEY `idx_room` (`room_code`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `class_sections`
--
ALTER TABLE `class_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_class_sections_name` (`name`);

--
-- Indexes for table `deduction_rates`
--
ALTER TABLE `deduction_rates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_deduction_type` (`deduction_type`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_departments_name` (`name`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_employees_user_id` (`user_id`),
  ADD KEY `idx_employees_department` (`department_id`),
  ADD KEY `idx_employees_status` (`status`),
  ADD KEY `idx_employees_position_id` (`position_id`),
  ADD KEY `idx_salary_grade_step` (`salary_grade`,`step_increment`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employee_status` (`employee_id`,`status`);

--
-- Indexes for table `payroll_periods`
--
ALTER TABLE `payroll_periods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_dates` (`start_date`,`end_date`);

--
-- Indexes for table `payroll_records`
--
ALTER TABLE `payroll_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_employee_period` (`employee_id`,`period_id`),
  ADD KEY `idx_payroll_status` (`status`),
  ADD KEY `idx_period_status` (`status`,`period_id`),
  ADD KEY `period_id` (`period_id`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_positions_title_per_dept` (`title`,`department_id`),
  ADD KEY `fk_positions_department_id` (`department_id`),
  ADD KEY `idx_positions_salary_grade` (`salary_grade`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `salary_grades`
--
ALTER TABLE `salary_grades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_grade_step` (`salary_grade`,`step`),
  ADD KEY `idx_salary_grade` (`salary_grade`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `tax_brackets`
--
ALTER TABLE `tax_brackets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `class_schedules`
--
ALTER TABLE `class_schedules`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `class_sections`
--
ALTER TABLE `class_sections`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `deduction_rates`
--
ALTER TABLE `deduction_rates`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll_periods`
--
ALTER TABLE `payroll_periods`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payroll_records`
--
ALTER TABLE `payroll_records`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `salary_grades`
--
ALTER TABLE `salary_grades`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=185;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tax_brackets`
--
ALTER TABLE `tax_brackets`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_attendance_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `class_schedules`
--
ALTER TABLE `class_schedules`
  ADD CONSTRAINT `fk_schedule_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_schedule_room` FOREIGN KEY (`room_code`) REFERENCES `rooms` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_schedule_section` FOREIGN KEY (`section_id`) REFERENCES `class_sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_schedule_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `fk_employees_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_employees_position_id` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_employees_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `leaves`
--
ALTER TABLE `leaves`
  ADD CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payroll_records`
--
ALTER TABLE `payroll_records`
  ADD CONSTRAINT `fk_payroll_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_records_ibfk_1` FOREIGN KEY (`period_id`) REFERENCES `payroll_periods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `positions`
--
ALTER TABLE `positions`
  ADD CONSTRAINT `fk_positions_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
