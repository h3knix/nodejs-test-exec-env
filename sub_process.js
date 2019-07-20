#!/usr/bin/env node

if ( process.env.unique_env_test_variable ) {
  console.log(process.env.unique_env_test_variable);
  process.exit(1);
} else {
  console.log('no env');
  process.exit(0);
}
