import mypackage.mythread1;
import mypackage.mythread2;
class hemanth{
    public static void main(String[]args)
    {
        mythread1 m1=new mythread1();
         mythread2 m2=new mythread2();

        m1.start();
        m2.start();
       // m3.start();

        
    }
}
