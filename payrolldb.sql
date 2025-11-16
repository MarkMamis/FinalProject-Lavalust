-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 16, 2025 at 09:19 AM
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
(5, 'EMP001', 7, 8, 25, '2025-11-05', 'active', NULL, '2025-11-05 11:37:03', '2025-11-16 01:49:49', NULL, 1),
(6, 'EMP002', 8, 8, 23, '2025-11-05', 'active', NULL, '2025-11-05 11:42:58', '2025-11-16 01:49:52', NULL, 1),
(11, 'EMP003', 9, 8, 22, '2025-11-05', 'active', NULL, '2025-11-05 11:46:33', '2025-11-16 01:49:55', NULL, 1),
(12, 'EMP004', 10, 8, 30, '2025-11-05', 'active', NULL, '2025-11-05 11:47:19', '2025-11-16 01:50:05', NULL, 1),
(13, 'EMP005', 11, 8, 30, '2025-11-06', 'active', NULL, '2025-11-05 20:09:04', '2025-11-16 01:50:08', NULL, 1),
(14, 'EMP006', 12, 8, 23, '2026-01-01', 'active', NULL, '2025-11-06 02:11:20', '2025-11-16 01:50:10', NULL, 1),
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
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `title`, `department_id`, `description`, `created_at`, `updated_at`) VALUES
(21, 'Associate Professor I', 8, NULL, '2025-11-05 20:48:12', NULL),
(22, 'Associate Professor II', 8, NULL, '2025-11-05 20:48:16', NULL),
(23, 'Associate Professor III', 8, NULL, '2025-11-05 20:48:20', NULL),
(24, 'Associate Professor IV', 8, NULL, '2025-11-05 20:48:42', NULL),
(25, 'Instructor I', 8, NULL, '2025-11-05 20:48:58', NULL),
(26, 'Instructor II', 8, NULL, '2025-11-05 20:49:05', NULL),
(27, 'Instructor III', 8, NULL, '2025-11-05 20:49:09', NULL),
(28, 'Instructor IV', 8, NULL, '2025-11-05 20:49:13', NULL),
(29, 'Assistant Professor I', 8, NULL, '2025-11-05 20:49:41', NULL),
(30, 'Assistant Professor II', 8, NULL, '2025-11-05 20:49:45', NULL),
(31, 'Assistant Professor III', 8, NULL, '2025-11-05 20:49:49', NULL),
(32, 'Assistant Professor IV', 8, NULL, '2025-11-05 20:49:52', NULL),
(34, 'Computer Laboratory Technician', 8, NULL, '2025-11-05 20:51:46', NULL);

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
(20, 'edniel1222@gmail.com', 'Arfff', '', '', 'employee', 1, NULL, '2025-11-15 22:10:37', NULL);

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
  ADD KEY `fk_positions_department_id` (`department_id`);

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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll_records`
--
ALTER TABLE `payroll_records`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
