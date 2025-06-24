const calculatePercentages = (files = []) => {
  const total = files.length;
  const counts = {
    Approved: 0,
    Rejected: 0,
    "Not Applicable": 0,
    Pending: 0,
  };

  files.forEach(file => {
    if (counts[file.status] !== undefined) {
      counts[file.status]++;
    }
  });

  const toPercent = (count) => (total ? ((count / total) * 100).toFixed(2) : "0.00");

  return {
    total,
    approved: toPercent(counts.Approved),
    rejected: toPercent(counts.Rejected),
    notApplicable: toPercent(counts["Not Applicable"]),
    pending: toPercent(counts.Pending),
  };
}

exports.calculatePercentages = calculatePercentages