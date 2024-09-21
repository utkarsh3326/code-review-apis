const express = require('express');
const router = express.Router();
const requestData = require('../json/pulls.json');
const reviewData = require('../json/reviews.json');
const { filterByDateRange, mapReviewData, getPRStatus } = require('../utils/pullRequetsUtils');

// GET /api/pull_requests
router.get('/', (req, res) => {
    try {
        const { status, dateRange } = req.query;

        // Map pull request data
        let data = requestData.map(d => ({
            owner: d.user.login,
            repository: d.base?.repo?.name,
            title: d.title,
            head_branch: d.base?.ref,
            merged_at: d.merged_at,
            created_at: d.created_at,
            req_num: d.number,
            state: d.state
        }));

        // Apply date range filter if specified
        if (dateRange) {
            data = filterByDateRange(data, dateRange);
        }

        // Map review data
        const reviewMap = mapReviewData(reviewData);

        // Merge pull request data with review data
        let finalData = data.map(d => {
            const obj = {
                ...d,
                reviewer: reviewMap[d.req_num] ? reviewMap[d.req_num].reviewer : [],
                status: getPRStatus(reviewMap[d.req_num] ? reviewMap[d.req_num].state : d.state)
            }
            delete (obj.req_num);
            delete (obj.state);
            return obj;
        });

        // Apply status filter if specified
        if (status) {
            finalData = finalData.filter(d => d.status && d.status.toLowerCase() === status.toLowerCase());
        }

        return res.json(finalData);
    } catch (error) {
        console.error('Error fetching pull requests:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = { getPullRequests: router };
