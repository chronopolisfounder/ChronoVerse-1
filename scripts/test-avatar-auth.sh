#!/usr/bin/env bash
# Start the dev server
npm run dev & 
DEV_PID=$!
echo "Waiting for dev server to start..."
sleep 5
# Run Playwright tests
npx playwright test tests/avatar-auth.spec.ts --project=chromium --reporter=dot
TEST_RESULT=$?
# Cleanup
kill $DEV_PID
exit $TEST_RESULT
