<?php defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed'); ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Login</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 2rem; }
        .container { max-width: 420px; margin: 0 auto; }
        .field { margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Login</h1>
        <?php if (!empty($_GET['error'])): ?>
            <div style="color: #b00020; margin-bottom: 1rem"><?php echo htmlspecialchars($_GET['error']); ?></div>
        <?php endif; ?>
        <form method="POST" action="/login">
            <div class="field">
                <label for="email">Email</label><br>
                <input id="email" name="email" type="email" required style="width:100%">
            </div>
            <div class="field">
                <label for="password">Password</label><br>
                <input id="password" name="password" type="password" required style="width:100%">
            </div>
            <div class="field">
                <button type="submit">Sign in</button>
            </div>
        </form>
    </div>
</body>
</html>
