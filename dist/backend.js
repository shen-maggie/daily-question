(function () {
  const config = window.SIDEQUEST_CONFIG || {};
  const configured = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase);
  let client = null;
  let user = null;
  let circleId = null;
  let inviteCode = null;
  let channel = null;

  function colorForName(name) {
    const colors = ["face-yellow", "face-blue", "face-pink", "face-green"];
    const total = [...name].reduce((sum, character) => sum + character.charCodeAt(0), 0);
    return colors[total % colors.length];
  }

  function mapMessage(row) {
    const name = row.profiles?.display_name || (row.user_id === user?.id ? "You" : "Friend");
    return {
      id: row.id,
      author: row.user_id === user?.id ? "You" : name,
      initial: row.user_id === user?.id ? "You" : name.charAt(0).toUpperCase(),
      color: colorForName(name),
      text: row.body,
      time: new Date(row.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
  }

  async function ensureProfile() {
    const displayName = localStorage.getItem("sidequest-display-name") || config.displayName || "You";
    const { error } = await client.from("profiles").upsert({ id: user.id, display_name: displayName });
    if (error) throw error;
  }

  async function findCircle() {
    const savedCircle = localStorage.getItem("sidequest-supabase-circle-id");
    if (savedCircle) {
      circleId = savedCircle;
      return;
    }

    const inviteFromUrl = new URLSearchParams(window.location.search).get("circle");
    if (inviteFromUrl) {
      await joinCircle(inviteFromUrl);
      window.history.replaceState({}, "", `${window.location.pathname}${window.location.hash || "#today"}`);
      return;
    }

    const { data: memberships, error } = await client.from("circle_members").select("circle_id").limit(1);
    if (error) throw error;
    if (memberships?.length) {
      circleId = memberships[0].circle_id;
      localStorage.setItem("sidequest-supabase-circle-id", circleId);
      return;
    }
  }

  async function init() {
    if (!configured) return { enabled: false };
    client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    let { data: { session } } = await client.auth.getSession();
    if (!session) {
      const result = await client.auth.signInAnonymously();
      if (result.error) throw result.error;
      session = result.data.session;
    }
    user = session.user;
    await ensureProfile();
    await findCircle();
    let circleName = null;
    if (circleId) {
      const { data } = await client.from("circles").select("name,invite_code").eq("id", circleId).single();
      circleName = data?.name || null;
      inviteCode = data?.invite_code || inviteCode;
    }
    return { enabled: true, userId: user.id, circleId, circleName, inviteCode };
  }

  async function createCircle(name) {
    if (!configured) return null;
    const { data, error } = await client.rpc("create_circle", { circle_name: name });
    if (error) throw error;
    const created = data[0];
    circleId = created.id;
    inviteCode = created.invite_code;
    localStorage.setItem("sidequest-supabase-circle-id", circleId);
    localStorage.setItem("sidequest-invite-code", inviteCode);
    return created;
  }

  async function joinCircle(code) {
    if (!configured) return null;
    const { data, error } = await client.rpc("join_circle_by_code", { code });
    if (error) throw error;
    circleId = data;
    localStorage.setItem("sidequest-supabase-circle-id", circleId);
    return circleId;
  }

  async function saveAnswer(mode, body, visibility) {
    if (!configured) return null;
    const today = new Date().toISOString().slice(0, 10);
    const { data: question, error: questionError } = await client
      .from("questions").select("id").eq("question_date", today).eq("mode", mode).single();
    if (questionError) throw questionError;
    const payload = { question_id: question.id, user_id: user.id, circle_id: circleId, body, visibility };
    const { data, error } = await client.from("answers").upsert(payload, { onConflict: "question_id,user_id" }).select().single();
    if (error) throw error;
    return data;
  }

  async function loadMessages() {
    if (!configured || !circleId) return [];
    const { data, error } = await client
      .from("messages")
      .select("id,user_id,body,created_at,profiles(display_name)")
      .eq("circle_id", circleId).order("created_at").limit(100);
    if (error) throw error;
    return data.map(mapMessage);
  }

  async function sendMessage(body) {
    if (!configured || !circleId) return null;
    const { data, error } = await client.from("messages")
      .insert({ circle_id: circleId, user_id: user.id, body }).select().single();
    if (error) throw error;
    return data;
  }

  function subscribeToMessages(onChange) {
    if (!configured || !circleId) return;
    if (channel) client.removeChannel(channel);
    channel = client.channel(`circle:${circleId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `circle_id=eq.${circleId}` }, onChange)
      .subscribe();
  }

  window.sidequestBackend = {
    enabled: configured,
    init,
    createCircle,
    joinCircle,
    saveAnswer,
    loadMessages,
    sendMessage,
    subscribeToMessages,
  };
})();
