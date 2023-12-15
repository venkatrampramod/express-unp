const Author = require("../models/author");

const Unp = require("../models/unps");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Unps.
exports.unps_list = asyncHandler(async (req, res, next) => {
    const allUnps = await Unp.find().sort({ site_name: 1 }).exec();

    res.render("unps_list", {
        title: "Usernames & Passwords List",
        unps_list: allUnps,
    });
});

// Display detail page for a specific Unp.
exports.unps_detail = asyncHandler(async (req, res, next) => {
    // Get details of Unps record
    const [ unps ] = await Promise.all([
        Unp.findById(req.params.id).exec()
    ]);

    if (unps === null) {
        // No results.
        const err = new Error("Unps record not found");
        err.status = 404;
        return next(err);
    }

    console.log(unps)
    res.render("unps_detail", {
        title: "Unp Detail",
        unps: unps
    });
});

// Display Unps record create form on GET.
exports.unps_create_get = (req, res, next) => {
    req.body.info = ''
    console.log(`GET creating unps record ------------------- info is ${req.body.info}`)
    res.render("unps_form", { title: "Create Unp Record" });
};

// Handle Unps record create on POST.
exports.unps_create_post = [
    // Validate and sanitize fields.
    body("site_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Site name must be specified."),
    body("url")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("url must be specified."),
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username must be specified."),
    body("password")
        .trim()
        .isLength({ min: 1 }),
    body("info"),
    body("account_number"),
    body("security_questions"),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Unps record with escaped and trimmed data
        const unp = new Unp({
            site_name: req.body.site_name,
            url: req.body.url,
            username: req.body.username,
            password: req.body.password,
            security_questions: req.body.security_questions,
            info: req.body.info,
            account_number: req.body.account_number,
        });

        console.log(`POSTed data ${unp}`)

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("unps_form", {
                title: "Create Unps Record",
                unp: unp,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.

            // Save author.
            await unp.save();
            // Redirect to new author record.
            res.redirect(unp.urlToUnp);
        }
    }),
];

// Display Unps record delete form on GET.
exports.unps_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [ unps ] = await Promise.all([
        Unp.findById(req.params.id).exec(),
    ]);

    if (unps === null) {
        console.log("Could not find Unp record for deletion")
        // No results.
        res.redirect("/catalog/unps");
    }

    console.log(`Found Unp record for deletion ${unps}`)

    res.render("unps_delete", {
        title: "Delete Unps Record",
        unps: unps
    });
});

// Handle Unps Record delete on POST.
exports.unps_delete_post = asyncHandler(async (req, res, next) => {
    // Delete object and redirect to the list of unps records.
    await Unp.findByIdAndDelete(req.body.id);
    res.redirect("/catalog/unps");
});

// Display Unps Record update form on GET.
exports.unps_update_get = asyncHandler(async (req, res, next) => {
    console.log(`GET ${req.params.id} -----------------`)
    const unps = await Unp.findById(req.params.id).exec();
    res.render("unps_form", { title: "Update Unps record", unps: unps });
});

// Handle Unps Record update on POST.
exports.unps_update_post = [
    // Validate and sanitize fields.
    body("site_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Site name must be specified."),
    body("url")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("url must be specified."),
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username must be specified."),
    body("password")
        .trim()
        .isLength({ min: 1 }),
    body("info"),
    body("account_number"),
    body("security_questions"),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {

        console.log(`POST ${req.params}`)
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Unps Record object with escaped and trimmed data (and the old id!)
        const unp = new Unp({
            site_name: req.body.site_name,
            url: req.body.url,
            username: req.body.username,
            password: req.body.password,
            security_questions: req.body.security_questions,
            info: req.body.info,
            account_number: req.body.account_number,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render("unps_form", {
                title: "Update Unps record",
                unp: unp,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            await Unp.findByIdAndUpdate(req.params.id, unp);
            res.redirect(unp.urlToUnp);
        }
    }),
];
