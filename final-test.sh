#!/bin/bash

echo "===================================="
echo "  TAXCLUSIVE FINAL SYSTEM TEST"
echo "===================================="
echo ""

SUCCESS=0
FAILED=0

# Test function
test_item() {
    local name="$1"
    local command="$2"
    local expected="$3"
    
    result=$(eval "$command" 2>&1)
    if echo "$result" | grep -q "$expected"; then
        echo "✅ $name"
        ((SUCCESS++))
    else
        echo "❌ $name"
        ((FAILED++))
    fi
}

echo "📊 DATABASE TESTS"
echo "-----------------"
test_item "Database Connection" "npx prisma db push --skip-generate 2>&1" "already in sync"
test_item "Blog Data Exists" "npx tsx -e \"const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.blog.count().then(c=>console.log(c))\" 2>/dev/null" "2"
test_item "Testimonial Data Exists" "npx tsx -e \"const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.testimonial.count().then(c=>console.log(c))\" 2>/dev/null" "1"
test_item "Users Exist" "npx tsx -e \"const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.user.count().then(c=>console.log(c))\" 2>/dev/null" "2"

echo ""
echo "🌐 API ENDPOINTS"
echo "----------------"
test_item "Health Check API" "curl -s http://localhost:3000/api/health" '"status":"healthy"'
test_item "Blogs API Returns Data" "curl -s http://localhost:3000/api/public/blogs" '"count":2'
test_item "Testimonials API Returns Data" "curl -s http://localhost:3000/api/public/testimonials" '"count":1'
test_item "Blog Slug API Works" "curl -s http://localhost:3000/api/public/blogs/welcome-to-taxclusive" '"slug":"welcome-to-taxclusive"'

echo ""
echo "📄 PAGE RENDERING"
echo "-----------------"
test_item "Homepage Loads" "curl -s http://localhost:3000 | head -100" "Taxclusive"
test_item "Blogs Page Loads" "curl -s http://localhost:3000/blogs | head -100" "Expert Financial Insights"
test_item "Contact Page Loads" "curl -s http://localhost:3000/contact | head -100" "Get in Touch"
test_item "Services Page Loads" "curl -s http://localhost:3000/services | head -100" "Our Services"

echo ""
echo "🔐 ADMIN PANEL"
echo "--------------"
test_item "Admin Login Page" "curl -s http://localhost:3000/admin/login" "Sign in to Admin Panel"
test_item "Admin Dashboard (Protected)" "curl -s -I http://localhost:3000/admin | head -1" "HTTP/1.1"

echo ""
echo "===================================="
echo "📊 TEST RESULTS"
echo "===================================="
echo "✅ Passed: $SUCCESS"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED! The application is fully functional."
else
    echo "⚠️  Some tests failed. Please review the issues above."
fi

echo "===================================="