<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Register - PayFlow HR</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; background:#f7fafc; color:#111}
    .container{max-width:480px;margin:40px auto;padding:24px;background:#fff;border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.06)}
    label{display:block;margin-bottom:6px;font-weight:600}
    input,select{width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;margin-bottom:12px}
    button{background:#0366d6;color:#fff;padding:10px 14px;border-radius:6px;border:0;cursor:pointer}
    .msg{padding:10px;border-radius:6px;margin-bottom:12px}
    .success{background:#e6ffed;border:1px solid #c6f6d5;color:#064e3b}
    .error{background:#fff5f5;border:1px solid #fed7d7;color:#742a2a}
  </style>
</head>
<body>
  <div class="container">
    <h2>Register</h2>
    <?php if (isset($_GET['success'])): ?>
      <div class="msg success">Registration successful. You may now <a href="/auth">log in</a>.</div>
    <?php endif; ?>
    <?php if (isset($_GET['error'])): ?>
      <div class="msg error"><?php echo htmlspecialchars($_GET['error']); ?></div>
    <?php endif; ?>

    <form action="/register" method="post">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required placeholder="you@example.com" />

      <label for="password">Password</label>
      <input id="password" name="password" type="password" required placeholder="Create a password" />

      <label for="password_confirm">Confirm password</label>
      <input id="password_confirm" name="password_confirm" type="password" required placeholder="Confirm password" />

      <label for="role">Role</label>
      <select id="role" name="role">
        <option value="employee">Employee</option>
        <option value="hr">HR</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Create account</button>
    </form>

    <script>
      // simple client-side validation for password match
      const form = document.querySelector('form');
      form.addEventListener('submit', function(e){
        const p = document.getElementById('password').value;
        const c = document.getElementById('password_confirm').value;
        if (p !== c) {
          e.preventDefault();
          alert('Passwords do not match');
        }
      });
    </script>
  </div>
</body>
</html>
