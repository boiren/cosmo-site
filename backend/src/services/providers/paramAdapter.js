// ============================================================
// Param Adapter
// Env: PARAM_CLIENT_CODE, PARAM_CLIENT_USERNAME, PARAM_CLIENT_PASSWORD, PARAM_GUID
// Dokümantasyon: https://dev.param.com.tr
// ============================================================

exports.init = async (data) => {
  throw new Error("Param entegrasyonu henüz yapılandırılmadı.")
}

exports.handleCallback = async (body) => {
  return { success: false }
}

exports.handleWebhook = async (body) => {
  return { received: true }
}