import { ref } from 'vue';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export function useRSVP() {
  const isLoading = ref(false);
  const loadingMsg = ref('');
  const error = ref(null);

  async function uploadComprovante(file) {
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from('comprovantes')
      .upload(fileName, file, { contentType: file.type, upsert: false });

    if (uploadError) throw new Error(`Upload falhou: ${uploadError.message}`);

    const { data: urlData } = supabase.storage
      .from('comprovantes')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  async function submitRSVP(formData, comprovanteFile) {
    isLoading.value = true;
    error.value = null;

    try {
      let comprovanteUrl = null;

      if (comprovanteFile) {
        loadingMsg.value = 'Enviando comprovante...';
        comprovanteUrl = await uploadComprovante(comprovanteFile);
      }

      loadingMsg.value = 'Registrando confirmação...';
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          guestsCount: formData.guestsCount,
          childrenUnder4: formData.childrenUnder4  || undefined,
          childrenUnder10: formData.childrenUnder10 || undefined,
          childrenAge11: formData.childrenAge11   || undefined,
          dietary: formData.dietary || undefined,
          comprovanteUrl: comprovanteUrl || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Erro ao confirmar presença.');
      }

      return await res.json();
    } catch (e) {
      error.value = e.message || 'Não foi possível confirmar. Tente novamente.';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return { submitRSVP, isLoading, loadingMsg, error };
}
