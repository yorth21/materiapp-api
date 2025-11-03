<#import "template.ftl" as layout>
<@layout.registrationLayout>
    <#if message?has_content>
        <div class="alert alert-${message.type}">
            ${message.summary}
        </div>
    </#if>

    <form id="kc-register-form" action="${url.registrationAction}" method="post">
        <div class="form-group">
            <label for="username">${msg("username")}</label>
            <input type="text" id="username" name="username" value="${(register.formData.username)!''}" required>
        </div>

        <div class="form-group">
            <label for="email">${msg("email")}</label>
            <input type="email" id="email" name="email" value="${(register.formData.email)!''}" required>
        </div>

        <div class="form-group">
            <label for="code">Código</label>
            <input type="text" id="code" name="code" value="${(register.formData.code)!''}">
        </div>

        <div class="form-group">
            <label for="firstName">${msg("firstName")}</label>
            <input type="text" id="firstName" name="firstName" value="${(register.formData.firstName)!''}">
        </div>

        <div class="form-group">
            <label for="lastName">${msg("lastName")}</label>
            <input type="text" id="lastName" name="lastName" value="${(register.formData.lastName)!''}">
        </div>

        <div class="form-group">
            <label for="password">${msg("password")}</label>
            <input type="password" id="password" name="password" required>
        </div>

        <div class="form-group">
            <label for="password-confirm">${msg("passwordConfirm")}</label>
            <input type="password" id="password-confirm" name="password-confirm" required>
        </div>

        <div class="form-actions">
            <input type="submit" value="${msg("doRegister")}">
        </div>
    </form>
</@layout.registrationLayout>
