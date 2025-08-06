#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskvibe.settings')
django.setup()

from django.contrib.auth.models import User

def fix_admin_permissions():
    print("🔧 Fixing admin permissions...")
    
    # Check if admin user exists
    try:
        admin_user = User.objects.get(username='amin')
        print(f"✅ Found user: {admin_user.username}")
        
        # Make sure user is staff and superuser
        if not admin_user.is_staff:
            admin_user.is_staff = True
            print("✅ Made user staff")
        
        if not admin_user.is_superuser:
            admin_user.is_superuser = True
            print("✅ Made user superuser")
        
        admin_user.save()
        print(f"✅ User {admin_user.username} is now admin!")
        
        # Verify permissions
        print(f"   - is_staff: {admin_user.is_staff}")
        print(f"   - is_superuser: {admin_user.is_superuser}")
        print(f"   - is_active: {admin_user.is_active}")
        
    except User.DoesNotExist:
        print("❌ User 'amin' not found. Creating new admin user...")
        
        # Create new superuser
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@taskvibe.com',
            password='admin123456'
        )
        print(f"✅ Created new admin user: {admin_user.username}")
        print("   Username: admin")
        print("   Password: admin123456")
    
    # List all superusers
    print("\n📋 All superusers:")
    superusers = User.objects.filter(is_superuser=True)
    for user in superusers:
        print(f"   - {user.username} (staff: {user.is_staff}, active: {user.is_active})")
    
    print("\n🎉 Admin permissions fixed! You can now access /admin/")

if __name__ == '__main__':
    fix_admin_permissions() 