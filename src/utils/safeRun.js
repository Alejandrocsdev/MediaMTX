const safeRun = async (fn) => {
  try {
    await fn();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = safeRun;
