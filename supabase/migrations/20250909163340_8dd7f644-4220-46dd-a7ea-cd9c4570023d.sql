-- Create RLS policies for subjects table
CREATE POLICY "Users can view their own subjects" 
ON public.subjects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subjects" 
ON public.subjects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subjects" 
ON public.subjects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subjects" 
ON public.subjects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for lessons table
CREATE POLICY "Users can view their own lessons" 
ON public.lessons 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lessons" 
ON public.lessons 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lessons" 
ON public.lessons 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lessons" 
ON public.lessons 
FOR DELETE 
USING (auth.uid() = user_id);