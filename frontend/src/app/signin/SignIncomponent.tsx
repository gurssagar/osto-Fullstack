"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ShieldCheck } from 'lucide-react'
import { loginAction } from '@/app/actions/auth'
import { toast } from 'sonner'
 
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})
type SignInFormValues = z.infer<typeof signInSchema>
const SignInComponent: React.FC = () => {
  const navigate = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })
  const onSubmit = async (data: SignInFormValues) => {
    setLoginError(null)
    
    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)
      
      const result = await loginAction(formData)
      
      if (!result.success) {
        setLoginError(result.error || 'Login failed')
        toast.error(result.error || 'Login failed')
        return
      }
      
      toast.success('Login successful!')
      navigate.push('/dashboard')
    } catch (error) {
      console.error('Sign in error:', error)
      const errorMessage = 'An unexpected error occurred. Please try again.'
      setLoginError(errorMessage)
      toast.error(errorMessage)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="text-center"
        >
          <Link href="/" className="flex justify-center items-center mb-5">
            <div className="h-12 w-12 rounded-md bg-[#1e3a8a] flex items-center justify-center text-white">
              <ShieldCheck size={28} />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-[#1e3a8a] dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-[#3b55f0] hover:text-[#f0f5ff]0"
            >
              create a new account
            </Link>
          </p>
        </div>
      </div>
      <div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        
      >
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="p-0 h-auto" type="button">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" {...register('rememberMe')} />
              <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                Remember me
              </Label>
            </div>
            {loginError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-[#1e3a8a] hover:bg-[#2d42db]"
              disabled={isSubmitting}
              
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignInComponent
