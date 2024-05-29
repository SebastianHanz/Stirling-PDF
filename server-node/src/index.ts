import 'dotenv/config';

/*
 * translation
*/

import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";

i18next.use(resourcesToBackend((language: string, namespace: string) => import(`../../shared-operations/public/locales/${namespace}/${language}.json`)))
    .init({
        debug: false,
        ns: ["common"], // Preload this namespace, no need to add the others, they will load once their module is loaded
        defaultNS: "common",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        initImmediate: false // Makes loading blocking but sync
    });

// list available modules
import { listOperatorNames } from "@stirling-pdf/shared-operations/src/workflow/operatorAccessor";
console.log("Available Modules: ", listOperatorNames());

/*
 * jobs
*/

if(process.env.JOBS_ENABLED === "True")
    import("./jobs/jobs-controller");

/**
 * database
 */

if(process.env.AUTH_ENABLED === "True")
    import("./data/sequelize-relations");

/*
 * EXPRESS
*/

import express from "express";
const app = express();
const PORT = 8000;

/*
 * auth
*/

if(process.env.AUTH_ENABLED === "True")
    import("./auth/auth-controller.ts").then(router => router.connect(app));

/*
 * api
*/

import api from "./routes/api/api-controller";
app.use("/api", api);

// viteNode
if (import.meta.env.PROD) {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
}

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export const viteNodeApp = app;