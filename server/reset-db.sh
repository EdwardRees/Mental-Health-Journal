#!/bin/bash


echo "Deleting migrations"
rm -rf ./prisma/migrations
echo "Deleted migrations"

echo "Resetting database"
prisma migrate reset
echo "Reset database"

echo "Creating new migrations"
prisma migrate dev --name test
echo "Created new migrations"

echo "Done"