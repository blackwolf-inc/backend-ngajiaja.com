const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { sequelize } = db;
const moment = require('moment');

class SuperAdminManageCourse {
    async getAllDataCourse() {
        const [ongoing_course, finished_course, all_course] = await Promise.all([
            sequelize.query(
                `
                SELECT COUNT(*) AS 'total'
                FROM Periods p
                JOIN Pengajars pj ON p.pengajar_id = pj.id
                JOIN Users u ON pj.user_id = u.id
                WHERE p.status = 'ACTIVATED'
                `,
                { type: QueryTypes.SELECT }
            ),
            sequelize.query(
                `
                SELECT COUNT(*) AS 'total'
                FROM Periods p
                JOIN Pengajars pj ON p.pengajar_id = pj.id
                JOIN Users u ON pj.user_id = u.id
                WHERE p.status = 'FINISHED'
                `,
                { type: QueryTypes.SELECT }
            ),
            sequelize.query(
                `
                SELECT COUNT(*) AS 'total'
                FROM Periods p
                JOIN Pengajars pj ON p.pengajar_id = pj.id
                JOIN Users u ON pj.user_id = u.id
                `,
                { type: QueryTypes.SELECT }
            ),
        ])

        return {
            ongoing_course: ongoing_course[0].total,
            finished_course: finished_course[0].total,
            all_course: all_course[0].total
        }
    }

    async getCourseOngoing(query, keywordStudent, keywordTeacher) {
        const { pageSize = 10 } = query;
        let page = query.page ? parseInt(query.page) : 1;
        const offset = (page - 1) * pageSize;

        let whereClause = "WHERE p.status = 'ACTIVATED'";
        if (keywordStudent) {
            whereClause += ` AND u1.nama LIKE '%${keywordStudent}%'`;
        }
        if (keywordTeacher) {
            whereClause += ` AND u2.nama LIKE '%${keywordTeacher}%'`;
        }

        const result = await sequelize.query(
            `
            SELECT 
                p.id AS 'period_id', p.status, p.tipe_bimbingan, p.peserta_id, u1.nama AS 'peserta_name', p.pengajar_id, u2.nama AS 'pengajar_name', p.hari_1, p.jam_1, p.hari_2, p.jam_2, u1.telp_wa AS 'telp_wa_peserta', u2.telp_wa AS 'telp_wa_pengajar',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT COUNT(*) FROM BimbinganRegulers br WHERE br.period_id = p.id AND br.absensi_peserta = 1)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT COUNT(*) FROM BimbinganTambahans bt WHERE bt.period_id = p.id AND bt.absensi_peserta = 1)
                    ELSE 0
                END AS 'hadir',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT COUNT(*) FROM BimbinganRegulers br WHERE br.period_id = p.id AND br.absensi_peserta = 0)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT COUNT(*) FROM BimbinganTambahans bt WHERE bt.period_id = p.id AND bt.absensi_peserta = 0)
                    ELSE 0
                END AS 'absen'
            FROM Periods p 
            JOIN Pesertas ps ON p.peserta_id = ps.id
            JOIN Users u1 ON ps.user_id = u1.id
            JOIN Pengajars pg ON p.pengajar_id = pg.id
            JOIN Users u2 ON pg.user_id = u2.id
            ${whereClause}
            LIMIT ${pageSize} OFFSET ${offset}
            `,
            { type: sequelize.QueryTypes.SELECT }
        );

        const totalCount = await sequelize.query(
            `
            SELECT COUNT(*) AS total
            FROM Periods p 
            JOIN Pesertas ps ON p.peserta_id = ps.id
            JOIN Users u1 ON ps.user_id = u1.id
            JOIN Pengajars pg ON p.pengajar_id = pg.id
            JOIN Users u2 ON pg.user_id = u2.id
            ${whereClause}
            `,
            { type: sequelize.QueryTypes.SELECT }
        );

        const totalPages = Math.ceil(totalCount[0].total / pageSize);
        return { result, page, totalPages };
    }

    async getCourseFinished(query, keywordStudent, keywordTeacher, startDate, endDate) {
        const { pageSize = 10 } = query;
        let page = query.page ? parseInt(query.page) : 1;
        const offset = (page - 1) * pageSize;

        let whereClause = "WHERE p.status = 'FINISHED'";
        if (keywordStudent) {
            whereClause += ` AND u1.nama LIKE '%${keywordStudent}%'`;
        }
        if (keywordTeacher) {
            whereClause += ` AND u2.nama LIKE '%${keywordTeacher}%'`;
        }
        if (startDate) {
            whereClause += ` AND (
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT MIN(tanggal) FROM BimbinganRegulers br WHERE br.period_id = p.id)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT MIN(tanggal) FROM BimbinganTambahans bt WHERE bt.period_id = p.id)
                    ELSE NULL
                END >= '${startDate}'
            )`;
        }
        if (endDate) {
            whereClause += ` AND (
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT MAX(tanggal) FROM BimbinganRegulers br WHERE br.period_id = p.id)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT MAX(tanggal) FROM BimbinganTambahans bt WHERE bt.period_id = p.id)
                    ELSE NULL
                END <= '${endDate}'
            )`;
        }

        const result = await sequelize.query(
            `
            SELECT 
                p.id AS 'period_id', p.status, p.tipe_bimbingan, p.peserta_id, u1.nama AS 'peserta_name', p.pengajar_id, u2.nama AS 'pengajar_name', u1.telp_wa AS 'telp_wa_peserta', u2.telp_wa AS 'telp_wa_pengajar',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT COUNT(*) FROM BimbinganRegulers br WHERE br.period_id = p.id AND br.absensi_peserta = 1)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT COUNT(*) FROM BimbinganTambahans bt WHERE bt.period_id = p.id AND bt.absensi_peserta = 1)
                    ELSE 0
                END AS 'hadir',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT COUNT(*) FROM BimbinganRegulers br WHERE br.period_id = p.id AND br.absensi_peserta = 0)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT COUNT(*) FROM BimbinganTambahans bt WHERE bt.period_id = p.id AND bt.absensi_peserta = 0)
                    ELSE 0
                END AS 'absen',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT MIN(tanggal) FROM BimbinganRegulers br WHERE br.period_id = p.id)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT MIN(tanggal) FROM BimbinganTambahans bt WHERE bt.period_id = p.id)
                    ELSE NULL
                END AS 'tanggal_mulai',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT MAX(tanggal) FROM BimbinganRegulers br WHERE br.period_id = p.id)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT MAX(tanggal) FROM BimbinganTambahans bt WHERE bt.period_id = p.id)
                    ELSE NULL
                END AS 'tanggal_selesai'
            FROM Periods p 
            JOIN Pesertas ps ON p.peserta_id = ps.id
            JOIN Users u1 ON ps.user_id = u1.id
            JOIN Pengajars pg ON p.pengajar_id = pg.id
            JOIN Users u2 ON pg.user_id = u2.id
            ${whereClause}
            LIMIT ${pageSize} OFFSET ${offset}
            `,
            { type: sequelize.QueryTypes.SELECT }
        );

        const totalCount = await sequelize.query(
            `
            SELECT COUNT(*) AS total
            FROM Periods p 
            JOIN Pesertas ps ON p.peserta_id = ps.id
            JOIN Users u1 ON ps.user_id = u1.id
            JOIN Pengajars pg ON p.pengajar_id = pg.id
            JOIN Users u2 ON pg.user_id = u2.id
            ${whereClause}
            `,
            { type: sequelize.QueryTypes.SELECT }
        );

        const totalPages = Math.ceil(totalCount[0].total / pageSize);
        return { result, page, totalPages };
    }

    async getCourseOngoingById(periodId) {
        const result = await sequelize.query(
            `
            SELECT 
                p.id AS 'period_id', p.status, p.tipe_bimbingan, p.peserta_id, u1.nama AS 'peserta_name', p.pengajar_id, u2.nama AS 'pengajar_name', p.hari_1, p.jam_1, p.hari_2, p.jam_2, u1.telp_wa AS 'telp_wa_peserta', u2.telp_wa AS 'telp_wa_pengajar',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT COUNT(*) FROM BimbinganRegulers br WHERE br.period_id = p.id AND br.absensi_peserta = 1)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT COUNT(*) FROM BimbinganTambahans bt WHERE bt.period_id = p.id AND bt.absensi_peserta = 1)
                    ELSE 0
                END AS 'hadir',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT COUNT(*) FROM BimbinganRegulers br WHERE br.period_id = p.id AND br.absensi_peserta = 0)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT COUNT(*) FROM BimbinganTambahans bt WHERE bt.period_id = p.id AND bt.absensi_peserta = 0)
                    ELSE 0
                END AS 'absen'
            FROM Periods p 
            JOIN Pesertas ps ON p.peserta_id = ps.id
            JOIN Users u1 ON ps.user_id = u1.id
            JOIN Pengajars pg ON p.pengajar_id = pg.id
            JOIN Users u2 ON pg.user_id = u2.id
            WHERE p.id = ${periodId}
            `,
            { type: sequelize.QueryTypes.SELECT }
        );

        return result[0];
    }

    async getCourseFinishedById(periodId) {
        const result = await sequelize.query(
            `
            SELECT 
                p.id AS 'period_id', p.status, p.tipe_bimbingan, p.peserta_id, u1.nama AS 'peserta_name', p.pengajar_id, u2.nama AS 'pengajar_name', u1.telp_wa AS 'telp_wa_peserta', u2.telp_wa AS 'telp_wa_pengajar',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT COUNT(*) FROM BimbinganRegulers br WHERE br.period_id = p.id AND br.absensi_peserta = 1)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT COUNT(*) FROM BimbinganTambahans bt WHERE bt.period_id = p.id AND bt.absensi_peserta = 1)
                    ELSE 0
                END AS 'hadir',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT COUNT(*) FROM BimbinganRegulers br WHERE br.period_id = p.id AND br.absensi_peserta = 0)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT COUNT(*) FROM BimbinganTambahans bt WHERE bt.period_id = p.id AND bt.absensi_peserta = 0)
                    ELSE 0
                END AS 'absen',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT MIN(tanggal) FROM BimbinganRegulers br WHERE br.period_id = p.id)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT MIN(tanggal) FROM BimbinganTambahans bt WHERE bt.period_id = p.id)
                    ELSE NULL
                END AS 'tanggal_mulai',
                CASE 
                    WHEN p.tipe_bimbingan = 'REGULER' THEN (SELECT MAX(tanggal) FROM BimbinganRegulers br WHERE br.period_id = p.id)
                    WHEN p.tipe_bimbingan = 'TAMBAHAN' THEN (SELECT MAX(tanggal) FROM BimbinganTambahans bt WHERE bt.period_id = p.id)
                    ELSE NULL
                END AS 'tanggal_selesai'
            FROM Periods p 
            JOIN Pesertas ps ON p.peserta_id = ps.id
            JOIN Users u1 ON ps.user_id = u1.id
            JOIN Pengajars pg ON p.pengajar_id = pg.id
            JOIN Users u2 ON pg.user_id = u2.id
            WHERE p.id = ${periodId}
            `,
            { type: sequelize.QueryTypes.SELECT }
        );
        return result[0];
    }

}

module.exports = SuperAdminManageCourse;