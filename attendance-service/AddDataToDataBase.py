import db_config
 
def seed_database():
    # 1. Open the connection we just verified
    conn = db_config.get_db_connection()
    if not conn:
        print("Could not connect to the database. Aborting.")
        return
 
    cursor = conn.cursor()
 
    # 2. Define your initial corporate employees list
    # Format: ('EmployeeID', 'Name', 'Department', 'Designation', 'DateJoined')
    employees = [
        ('1001', 'Preetham', 'associate software engineer', 'ASE', '2020-05-04'),
        ('1002', 'Vijesh', 'Testing', 'Quality Assurance', '2021-06-01'),
        ('1003', 'VaraLaxmi', 'Associate Software Engineer', 'Backend Developer', '2022-03-10'),
        ('1004', 'Bhagyaraj', 'Developer', 'Team Lead', '2026-06-03')
    ]
 
    try:
        print("Seeding database with employee profiles...")
        for emp in employees:
            # Check if the employee ID already exists so it doesn't crash if you run it twice
            cursor.execute("SELECT EmployeeID FROM Employees WHERE EmployeeID = ?", emp[0])
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO Employees (EmployeeID, Name, Department, Designation, DateJoined)
                    VALUES (?, ?, ?, ?, ?)
                """, emp)
                print(f"Added profile for: {emp[1]} ({emp[0]})")
            else:
                print(f"Skipped: {emp[1]} ({emp[0]}) already exists.")
       
        # 3. Save the changes permanently to SQL Server
        conn.commit()
        print("\nDatabase successfully seeded with office data!")
 
    except Exception as e:
        print(f"An error occurred while inserting data: {e}")
    finally:
        cursor.close()
        conn.close()
 
if __name__ == "__main__":
    seed_database()