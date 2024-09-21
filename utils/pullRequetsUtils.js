const PR_STATUS = {
    APPROVED: 'Approved',
    COMMENTED: 'Commented',
    OPEN: 'Open',
    CLOSED: 'Closed'
};

// Function to filter pull requests by date range
function filterByDateRange(data, dateRange) {
    const [startTime, endTime] = dateRange.split('to').map(time => Number(time));
    return data.filter(d => {
        const createdAt = new Date(d.created_at).getTime();
        return startTime <= createdAt && endTime >= createdAt;
    });
}

// Function to map review data by request number
function mapReviewData(reviewData) {
    return reviewData.reduce((acc, reviews) => {
        reviews.forEach(review => {
            const req_num = review.pull_request_url.split('/').pop();

            if (!acc[req_num]) {
                acc[req_num] = {
                    req_num,
                    pull_request_url: review.pull_request_url,
                    reviewer: [review.user.login],
                    state: review.state,
                    submitted_at: review.submitted_at
                };
            } else if (review.submitted_at > acc[req_num].submitted_at) {
                acc[req_num].submitted_at = review.submitted_at;
                acc[req_num].state = review.state;
            }
            if (!acc[req_num].reviewer.includes(review.user.login)) {
                acc[req_num].reviewer.push(review.user.login);
            }
        });
        return acc;
    }, {});
}

// Function to return status
function getPRStatus(status) {
    return PR_STATUS[status.toUpperCase()];
}

module.exports = { filterByDateRange, mapReviewData, getPRStatus };
