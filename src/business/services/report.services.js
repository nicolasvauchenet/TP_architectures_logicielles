export function makeReportService({ reportRepository }) {
  return {
    async occupancy() {
      return reportRepository.occupancy();
    },
  };
}
