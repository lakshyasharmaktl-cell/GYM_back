# GYM_back

  gym-backend/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Member.js
│   │   ├── Membership.js
│   │   ├── Attendance.js
│   │   ├── Payment.js
│   │   └── Expense.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── memberController.js
│   │   ├── membershipController.js
│   │   ├── attendanceController.js
│   │   ├── paymentController.js
│   │   └── dashboardController.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── membershipRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── generateMemberId.js
│   │   └── calculateDue.js
│   │
│   └── index.js
│
├── .env
├── package.json
└── .gitignore