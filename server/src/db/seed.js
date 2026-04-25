import db from "./index.js";
import { faculties, departments, users, supervisors } from "./schema.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const facultiesData = [
  {
    name: "School of Computing",
    code: "COM",
    description: "Computer Science and Engineering",
  },
  {
    name: "School of Management and Social Sciences",
    code: "MAN",
    description: "Management and Business Studies",
  },
  {
    name: "School of Communication",
    code: "CMC", // FIXED: Changed from COM to CMC to avoid duplicate key
    description: "Communication and Media Studies",
  },
  {
    name: "School of Allied Health Sciences",
    code: "MED",
    description: "Medical and Health Sciences",
  },
  {
    name: "School of Postgraduate Studies",
    code: "PGS",
    description: "Postgraduate Studies",
  },
];

const departmentsData = [
  // Computing (Mapped to COM)
  { name: "Computer Science", code: "CSC", facultyCode: "COM" },
  { name: "Cybersecurity", code: "CYB", facultyCode: "COM" },
  { name: "Data Science", code: "DSC", facultyCode: "COM" },
  { name: "Software Engineering", code: "SEN", facultyCode: "COM" },
  { name: "Information Technology", code: "ICT", facultyCode: "COM" },

  // Management (Mapped to MAN)
  { name: "Business Administration", code: "BAM", facultyCode: "MAN" },
  { name: "Economics", code: "ECO", facultyCode: "MAN" },
  { name: "Accounting", code: "ACC", facultyCode: "MAN" },
  { name: "Entrepreneurship", code: "ENT", facultyCode: "MAN" },
  { name: "Public Policy and Administration", code: "PAM", facultyCode: "MAN" },
  { name: "Criminology and Security Studies", code: "CSM", facultyCode: "MAN" },

  // Communication (Mapped to CMC)
  {
    name: "Mass Communication and Media Studies",
    code: "MCM",
    facultyCode: "CMC", // FIXED: Updated to match new faculty code
  },

  // Medicine (Mapped to MED)
  { name: "Public Health", code: "PUH", facultyCode: "MED" },
  { name: "Nursing Science", code: "NUR", facultyCode: "MED" },

  // Postgraduate (Mapped to PGS)
  { name: "Business Administration", code: "PGS-BAM", facultyCode: "PGS" },
  { name: "Information Technology", code: "PGS-ICT", facultyCode: "PGS" },
  { name: "Public Administration", code: "PGS-PAM", facultyCode: "PGS" },
  { name: "Public Health", code: "PGS-PUH", facultyCode: "PGS" },
];

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // 1. Insert faculties
    console.log("📚 Inserting faculties...");
    const insertedFaculties = await db
      .insert(faculties)
      .values(facultiesData)
      .returning();
    console.log(`✅ Inserted ${insertedFaculties.length} faculties`);

    // Create faculty code to ID mapping
    const facultyMap = {};
    insertedFaculties.forEach((faculty) => {
      facultyMap[faculty.code] = faculty.id;
    });

    // 2. Insert departments
    console.log("🏢 Inserting departments...");
    const departmentsToInsert = departmentsData.map((dept) => ({
      name: dept.name,
      code: dept.code,
      facultyId: facultyMap[dept.facultyCode],
    }));
    const insertedDepartments = await db
      .insert(departments)
      .values(departmentsToInsert)
      .returning();
    console.log(`✅ Inserted ${insertedDepartments.length} departments`);

    // 3. Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("Password1!", 10);

    const csDepartment = insertedDepartments.find((d) => d.code === "CSC");
    const computingFaculty = insertedFaculties.find((f) => f.code === "COM");

    if (!csDepartment || !computingFaculty) {
      throw new Error(
        "Could not find reference Faculty or Department for Admin user.",
      );
    }

    const [adminUser] = await db
      .insert(users)
      .values({
        email: "dev.praises+admin@gmail.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        phone: "+2348012345678",
        role: "supervisor",
        facultyId: computingFaculty.id,
        departmentId: csDepartment.id,
        isActive: true,
        isEmailVerified: true,
      })
      .returning();

    await db.insert(supervisors).values({
      userId: adminUser.id,
      isAdmin: true,
    });

    console.log("✅ Admin user created successfully");
    console.log("📧 Email: dev.praises+admin@gmail.com");
    console.log("🔑 Password: Password1!");

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
