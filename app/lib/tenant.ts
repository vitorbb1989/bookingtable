/**
 * app/lib/tenant.ts
 *
 * Helpers de resolução de contexto de tenant.
 * Aplica DEC-003: tenant_id sempre resolvido server-side, nunca via payload.
 */

import { cache } from 'react'
import { createClient } from '@/app/lib/supabase/server'

export type PublicTenantContext = {
  tenantId: string
  establishmentId: string
  tenantName: string
  brandColor: string
  logoUrl: string | null
  establishmentName: string
  timezone: string
}

export type AdminTenantContext = {
  userId: string
  tenantId: string
  tenantName: string
  tenantSlug: string
  brandColor: string
  logoUrl: string | null
  role: 'owner' | 'manager' | 'operator'
}

export const resolvePublicTenantContext = cache(
  async (
    tenantSlug: string,
    establishmentSlug: string
  ): Promise<PublicTenantContext | null> => {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('establishments')
      .select(`
        id,
        name,
        timezone,
        tenant:tenants!inner (
          id,
          name,
          brand_color,
          logo_url,
          slug
        )
      `)
      .eq('slug', establishmentSlug)
      .eq('tenant.slug', tenantSlug)
      .single()

    if (error || !data) return null

    const tenant = data.tenant as unknown as {
      id: string
      name: string
      brand_color: string
      logo_url: string | null
      slug: string
    }

    return {
      tenantId: tenant.id,
      establishmentId: data.id,
      tenantName: tenant.name,
      brandColor: tenant.brand_color,
      logoUrl: tenant.logo_url,
      establishmentName: data.name,
      timezone: data.timezone,
    }
  }
)

export const resolveAdminTenantContext = cache(
  async (): Promise<AdminTenantContext | null> => {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('tenant_memberships')
      .select(`
        role,
        tenant:tenants!inner (
          id,
          name,
          brand_color,
          logo_url,
          slug
        )
      `)
      .eq('user_id', user.id)
      .single()

    if (error || !data) return null

    const tenant = data.tenant as unknown as {
      id: string
      name: string
      brand_color: string
      logo_url: string | null
      slug: string
    }

    return {
      userId: user.id,
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantSlug: tenant.slug,
      brandColor: tenant.brand_color,
      logoUrl: tenant.logo_url,
      role: data.role as AdminTenantContext['role'],
    }
  }
)
